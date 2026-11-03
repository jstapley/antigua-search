import { fromArrayBuffer } from "geotiff";

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export interface Point {
  x: number;
  y: number;
}

export interface DiagramLine {
  type: "ridge" | "hip" | "valley" | "eave" | "rake";
  start: Point;
  end: Point;
  lengthFt: number;
}

export interface RoofDiagramData {
  lines: DiagramLine[];
  outlineFt: Point[];
  widthFt: number;
  heightFt: number;
  totals: { ridge: number; hip: number; valley: number; eave: number; rake: number };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchGeoTiff(url: string, key: string): Promise<any> {
  const res = await fetch(`${url}&key=${key}`);
  if (!res.ok) throw new Error(`GeoTIFF fetch failed: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const tiff = await fromArrayBuffer(buffer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const image = await (tiff as any).getImage();
  return image;
}

// Read a single-band GeoTIFF image and return { data, width, height, bbox }
async function readSingleBand(
  url: string,
  key: string
): Promise<{ data: number[]; width: number; height: number; bbox: number[] }> {
  const image = await fetchGeoTiff(url, key);
  const width: number = image.getWidth();
  const height: number = image.getHeight();
  const bbox: number[] = image.getBoundingBox(); // [west, south, east, north]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rasters = await (image as any).readRasters();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = Array.from(rasters[0] as any) as number[];
  return { data, width, height, bbox };
}

// ---------------------------------------------------------------------------
// Flood fill (4-connected) from seed pixel — returns boolean mask same size
// ---------------------------------------------------------------------------

function floodFill4(
  mask: number[],
  width: number,
  height: number,
  seedRow: number,
  seedCol: number
): Uint8Array {
  const result = new Uint8Array(width * height);
  const stack: number[] = [];

  // Treat any non-zero mask value as roof (API may return 0/1 or 0/255)
  const isRoof = (v: number) => v !== 0;

  // If center isn't roof, search in expanding radius up to 30px
  let foundRow = seedRow, foundCol = seedCol;
  let found = isRoof(mask[seedRow * width + seedCol]);
  if (!found) {
    outer: for (let radius = 1; radius <= 30; radius++) {
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const r = seedRow + dr, c = seedCol + dc;
          if (r >= 0 && r < height && c >= 0 && c < width && isRoof(mask[r * width + c])) {
            foundRow = r; foundCol = c; found = true; break outer;
          }
        }
      }
    }
  }
  if (!found) return result;

  const idx = foundRow * width + foundCol;
  stack.push(idx);
  result[idx] = 1;

  while (stack.length > 0) {
    const cur = stack.pop()!;
    const row = Math.floor(cur / width);
    const col = cur % width;
    const neighbors = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];
    for (const [r, c] of neighbors) {
      if (r < 0 || r >= height || c < 0 || c >= width) continue;
      const ni = r * width + c;
      if (result[ni] === 0 && isRoof(mask[ni])) {
        result[ni] = 1;
        stack.push(ni);
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Moore's neighbor boundary tracing (8-directional, Jacob's stopping criterion)
// Returns ordered list of boundary pixels [row, col]
// ---------------------------------------------------------------------------

const MOORE_ORDER = [
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
];

function mooreTrace(
  binaryMask: Uint8Array,
  width: number,
  height: number
): Array<[number, number]> {
  // Find topmost-leftmost pixel in mask
  let startRow = -1;
  let startCol = -1;
  outer: for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (binaryMask[r * width + c] === 1) {
        startRow = r;
        startCol = c;
        break outer;
      }
    }
  }
  if (startRow === -1) return [];

  const boundary: Array<[number, number]> = [];
  boundary.push([startRow, startCol]);

  // Entry direction: we arrived from the left (west), so backtrack direction index = 0 (west)
  let prevDir = 0; // index into MOORE_ORDER for the direction we came from
  let row = startRow;
  let col = startCol;

  // Start by trying counter-clockwise from the direction we came from
  // Jacob's stopping criterion: stop when we return to start pixel with same entry direction
  let first = true;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let found = false;
    // Try 8 neighbors starting counter-clockwise from previous backtrack direction
    for (let i = 1; i <= 8; i++) {
      const di = (prevDir + i) % 8;
      const [dr, dc] = MOORE_ORDER[di];
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
      if (binaryMask[nr * width + nc] === 1) {
        // Check Jacob's stopping criterion
        if (!first && nr === startRow && nc === startCol) {
          return boundary;
        }
        first = false;
        row = nr;
        col = nc;
        // backtrack direction = opposite of di
        prevDir = (di + 4) % 8;
        boundary.push([row, col]);
        found = true;
        break;
      }
    }
    if (!found) break; // isolated pixel
    if (boundary.length > width * height) break; // safety
  }

  return boundary;
}

// ---------------------------------------------------------------------------
// Douglas-Peucker polygon simplification
// ---------------------------------------------------------------------------

function perpendicularDist(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / len2;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function douglasPeucker(
  pts: Array<[number, number]>,
  epsilon: number
): Array<[number, number]> {
  if (pts.length <= 2) return pts;
  let maxDist = 0;
  let maxIdx = 0;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpendicularDist(pts[i][0], pts[i][1], ax, ay, bx, by);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }
  if (maxDist > epsilon) {
    const left = douglasPeucker(pts.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(pts.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [pts[0], pts[pts.length - 1]];
}

// ---------------------------------------------------------------------------
// Gaussian blur (5x5, sigma≈1)
// ---------------------------------------------------------------------------

const GAUSSIAN_5 = [
  1, 4, 7, 4, 1, 4, 16, 26, 16, 4, 7, 26, 41, 26, 7, 4, 16, 26, 16, 4, 1, 4,
  7, 4, 1,
];
const GAUSSIAN_SUM = 273;

function gaussianBlur5(data: number[] | Float64Array, width: number, height: number): Float64Array {
  const out = new Float64Array(width * height);
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let sum = 0;
      let wSum = 0;
      for (let kr = -2; kr <= 2; kr++) {
        for (let kc = -2; kc <= 2; kc++) {
          const nr = r + kr;
          const nc = c + kc;
          if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
          const w = GAUSSIAN_5[(kr + 2) * 5 + (kc + 2)];
          sum += data[nr * width + nc] * w;
          wSum += w;
        }
      }
      out[r * width + c] = sum / (wSum === 0 ? GAUSSIAN_SUM : wSum);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Laplacian (Sobel-based discrete approximation via ∇²≈ sum of second diffs)
// Using simple 3x3 Laplacian kernel: [0,1,0,1,-4,1,0,1,0]
// ---------------------------------------------------------------------------

function laplacian(data: Float64Array, width: number, height: number): Float64Array {
  const out = new Float64Array(width * height);
  for (let r = 1; r < height - 1; r++) {
    for (let c = 1; c < width - 1; c++) {
      const center = data[r * width + c];
      const lap =
        data[(r - 1) * width + c] +
        data[(r + 1) * width + c] +
        data[r * width + (c - 1)] +
        data[r * width + (c + 1)] -
        4 * center;
      out[r * width + c] = lap;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Connected components (4-connected) for binary mask
// Returns label array (0 = background)
// ---------------------------------------------------------------------------

function connectedComponents4(
  binary: Uint8Array,
  width: number,
  height: number
): { labels: Int32Array; count: number } {
  const labels = new Int32Array(width * height);
  let nextLabel = 1;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const i = r * width + c;
      if (binary[i] === 0 || labels[i] !== 0) continue;
      // BFS
      const queue: number[] = [i];
      labels[i] = nextLabel;
      let head = 0;
      while (head < queue.length) {
        const cur = queue[head++];
        const cr = Math.floor(cur / width);
        const cc = cur % width;
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
          const ni = nr * width + nc;
          if (binary[ni] === 1 && labels[ni] === 0) {
            labels[ni] = nextLabel;
            queue.push(ni);
          }
        }
      }
      nextLabel++;
    }
  }
  return { labels, count: nextLabel - 1 };
}

// ---------------------------------------------------------------------------
// PCA line fitting: fit a line through a set of [row, col] points
// Returns { cx, cy, dx, dy } where (cx,cy) is centroid, (dx,dy) is principal direction
// ---------------------------------------------------------------------------

function pcaLine(
  pixels: Array<[number, number]>
): { cx: number; cy: number; dx: number; dy: number } | null {
  if (pixels.length < 2) return null;
  let sumR = 0;
  let sumC = 0;
  for (const [r, c] of pixels) {
    sumR += r;
    sumC += c;
  }
  const cx = sumC / pixels.length;
  const cy = sumR / pixels.length;

  let sRR = 0;
  let sCC = 0;
  let sRC = 0;
  for (const [r, c] of pixels) {
    const dr = r - cy;
    const dc = c - cx;
    sRR += dr * dr;
    sCC += dc * dc;
    sRC += dr * dc;
  }

  // 2x2 covariance eigenvalue: largest eigenvector
  // [[sCC, sRC],[sRC, sRR]]
  const trace = sCC + sRR;
  const det = sCC * sRR - sRC * sRC;
  const disc = Math.sqrt(Math.max(0, (trace * trace) / 4 - det));
  const lam = trace / 2 + disc; // largest eigenvalue

  let dx = lam - sRR;
  let dy = sRC;
  const len = Math.hypot(dx, dy);
  if (len < 1e-9) {
    dx = 1;
    dy = 0;
  } else {
    dx /= len;
    dy /= len;
  }

  return { cx, cy, dx, dy };
}

// Project pixels onto line, find endpoints
function lineEndpoints(
  pixels: Array<[number, number]>,
  cx: number,
  cy: number,
  dx: number,
  dy: number
): { r1: number; c1: number; r2: number; c2: number } {
  let tMin = Infinity;
  let tMax = -Infinity;
  for (const [r, c] of pixels) {
    const t = (c - cx) * dx + (r - cy) * dy;
    if (t < tMin) tMin = t;
    if (t > tMax) tMax = t;
  }
  return {
    c1: cx + tMin * dx,
    r1: cy + tMin * dy,
    c2: cx + tMax * dx,
    r2: cy + tMax * dy,
  };
}

// ---------------------------------------------------------------------------
// Coordinate conversion helpers
// ---------------------------------------------------------------------------

interface GeoMeta {
  west: number;
  east: number;
  north: number;
  south: number;
  width: number;
  height: number;
  mppX: number; // meters per pixel X
  mppY: number; // meters per pixel Y
  centerCol: number;
  centerRow: number;
}

function buildGeoMeta(bbox: number[], width: number, height: number): GeoMeta {
  const [west, south, east, north] = bbox;

  // Google Solar API GeoTIFFs are in a projected CRS (UTM, meters) not WGS84 degrees.
  // Detect: degree values are always -180→180 (lng) and -90→90 (lat).
  // UTM eastings are typically 100,000–900,000 and northings 0–10,000,000.
  const isProjected = Math.abs(west) > 360 || Math.abs(north) > 90;

  let mppX: number, mppY: number;
  if (isProjected) {
    // Coordinates already in meters — divide extent by pixel count directly
    mppX = (east - west) / width;
    mppY = (north - south) / height;  // positive: north > south, row 0 = north
  } else {
    // WGS84 degrees — convert to meters via standard formula
    const centerLat_rad = (((north + south) / 2) * Math.PI) / 180;
    mppX = ((east - west) * 111320 * Math.cos(centerLat_rad)) / width;
    mppY = ((north - south) * 111320) / height;
  }

  return {
    west, east, north, south,
    width, height,
    mppX, mppY,
    centerCol: width / 2,
    centerRow: height / 2,
  };
}

function pixelToFt(
  row: number,
  col: number,
  meta: GeoMeta
): Point {
  const x = (col - meta.centerCol) * meta.mppX * 3.28084;
  const y = (meta.centerRow - row) * meta.mppY * 3.28084;
  return { x, y };
}

function distFt(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ---------------------------------------------------------------------------
// PCA on the building boundary to find the major axis angle
// ---------------------------------------------------------------------------

function buildingMajorAxisAngle(boundary: Array<[number, number]>): number {
  const fit = pcaLine(boundary);
  if (!fit) return 0;
  // dx is along columns (x), dy is along rows (y). Angle in image coords:
  return Math.atan2(fit.dy, fit.dx); // radians
}

// ---------------------------------------------------------------------------
// Edge type classification (eave vs rake)
// ---------------------------------------------------------------------------

function classifyEdge(
  start: Point,
  end: Point,
  majorAxisAngle: number
): "eave" | "rake" {
  const edgeAngle = Math.atan2(end.y - start.y, end.x - start.x);
  let diff = Math.abs(edgeAngle - majorAxisAngle);
  // Normalize to [0, PI/2]
  diff = diff % Math.PI;
  if (diff > Math.PI / 2) diff = Math.PI - diff;
  // If roughly parallel to major axis (diff < 45°) → eave; else → rake
  return diff < Math.PI / 4 ? "eave" : "rake";
}

// ---------------------------------------------------------------------------
// Point-in-polygon test (ray casting, even-odd rule)
// ---------------------------------------------------------------------------

function pointInPolygon(pt: Point, polygon: Point[]): boolean {
  const n = polygon.length;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ---------------------------------------------------------------------------
// Clip a line segment to the inside of a polygon.
// Returns the longest inside sub-segment, or null if none.
// ---------------------------------------------------------------------------

function clipSegmentToPolygon(
  p1: Point,
  p2: Point,
  polygon: Point[]
): [Point, Point] | null {
  // Collect all t values where segment crosses a polygon edge
  const ts: number[] = [0, 1];
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const a = polygon[i], b = polygon[(i + 1) % n];
    const ex = b.x - a.x, ey = b.y - a.y;
    const denom = dx * ey - dy * ex;
    if (Math.abs(denom) < 1e-10) continue; // parallel
    const fx = a.x - p1.x, fy = a.y - p1.y;
    const t = (fx * ey - fy * ex) / denom;
    const s = (fx * dy - fy * dx) / denom;
    if (t > 0 && t < 1 && s >= 0 && s <= 1) ts.push(t);
  }

  ts.sort((a, b) => a - b);

  // Find longest sub-segment whose midpoint is inside the polygon
  let bestT0 = -1, bestT1 = -1, bestLen = 0;
  for (let i = 0; i < ts.length - 1; i++) {
    const tmid = (ts[i] + ts[i + 1]) / 2;
    const mid = { x: p1.x + tmid * dx, y: p1.y + tmid * dy };
    if (pointInPolygon(mid, polygon)) {
      const len = ts[i + 1] - ts[i];
      if (len > bestLen) { bestLen = len; bestT0 = ts[i]; bestT1 = ts[i + 1]; }
    }
  }

  if (bestT0 < 0) return null;
  return [
    { x: p1.x + bestT0 * dx, y: p1.y + bestT0 * dy },
    { x: p1.x + bestT1 * dx, y: p1.y + bestT1 * dy },
  ];
}

// ---------------------------------------------------------------------------
// Gather pixels by connected-component label
// ---------------------------------------------------------------------------

function gatherByLabel(
  labels: Int32Array,
  count: number,
  imgWidth: number
): Map<number, Array<[number, number]>> {
  const map = new Map<number, Array<[number, number]>>();
  for (let label = 1; label <= count; label++) map.set(label, []);
  for (let i = 0; i < labels.length; i++) {
    const lbl = labels[i];
    if (lbl === 0) continue;
    const r = Math.floor(i / imgWidth);
    const c = i % imgWidth;
    map.get(lbl)!.push([r, c]);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Main exported function
// ---------------------------------------------------------------------------

export async function buildRoofDiagram(
  lat: number,
  lng: number
): Promise<RoofDiagramData | null> {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) throw new Error("GOOGLE_MAPS_API_KEY not set");

    // 1. Fetch DataLayers metadata
    const metaUrl =
      `https://solar.googleapis.com/v1/dataLayers:get` +
      `?location.latitude=${lat}&location.longitude=${lng}` +
      `&radiusMeters=50&view=IMAGERY_LAYERS&requiredQuality=LOW&key=${key}`;

    const metaRes = await fetch(metaUrl);
    if (!metaRes.ok) {
      console.error("DataLayers meta fetch failed:", metaRes.status, await metaRes.text());
      return null;
    }
    const metaJson = await metaRes.json();

    const maskUrl: string | undefined = metaJson.maskUrl;
    const dsmUrl: string | undefined = metaJson.dsmUrl;
    if (!maskUrl || !dsmUrl) {
      console.error("DataLayers response missing maskUrl or dsmUrl", metaJson);
      return null;
    }

    // 2. Fetch and parse GeoTIFFs in parallel
    const [mask, dsm] = await Promise.all([
      readSingleBand(maskUrl, key),
      readSingleBand(dsmUrl, key),
    ]);

    const { data: maskData, width, height, bbox } = mask;
    const { data: dsmData } = dsm;

    // Diagnostic: log raw values so we can verify coordinate system
    console.log(`DataLayers mask: ${width}×${height}px, bbox=[${bbox.map(v=>v.toFixed(6)).join(', ')}]`);
    console.log(`DataLayers DSM: ${dsm.width}×${dsm.height}px`);

    const meta = buildGeoMeta(bbox, width, height);
    console.log(`DataLayers meta: mppX=${meta.mppX.toFixed(4)}m/px, mppY=${meta.mppY.toFixed(4)}m/px`);

    // 3. Flood fill from center to isolate target building
    const centerRow = Math.floor(meta.centerRow);
    const centerCol = Math.floor(meta.centerCol);
    const buildingMask = floodFill4(maskData, width, height, centerRow, centerCol);
    const roofPixelCount = buildingMask.reduce((s, v) => s + v, 0);
    console.log(`DataLayers building mask: ${roofPixelCount} roof pixels (center ${centerRow},${centerCol})`);

    // 4. Trace boundary polygon
    const boundaryPixels = mooreTrace(buildingMask, width, height);
    console.log(`DataLayers boundary: ${boundaryPixels.length} pixels`);
    if (boundaryPixels.length < 4) {
      console.error("Boundary trace too short");
      return null;
    }

    // 5. Douglas-Peucker simplification (epsilon = 2.5 pixels)
    const simplified = douglasPeucker(boundaryPixels, 2.5);
    console.log(`DataLayers simplified polygon: ${simplified.length} vertices`);

    // 6. Convert boundary to feet coordinates
    const outlineFt: Point[] = simplified.map(([r, c]) => pixelToFt(r, c, meta));

    // Determine bounding box in feet
    const xs = outlineFt.map((p) => p.x);
    const ys = outlineFt.map((p) => p.y);
    const widthFt = Math.max(...xs) - Math.min(...xs);
    const heightFt = Math.max(...ys) - Math.min(...ys);

    // 7. DSM ridge/valley detection
    // 7a. Double Gaussian smooth (two passes reduces noise further)
    const smoothed1 = gaussianBlur5(dsmData, width, height);
    const smoothed = gaussianBlur5(smoothed1, width, height);

    // 7b. Laplacian
    const lap = laplacian(smoothed, width, height);

    // Find Laplacian std dev for threshold
    let lapMean = 0;
    let lapCount = 0;
    for (let i = 0; i < lap.length; i++) {
      if (buildingMask[i] === 1) {
        lapMean += lap[i];
        lapCount++;
      }
    }
    lapMean = lapCount > 0 ? lapMean / lapCount : 0;
    let lapStd = 0;
    for (let i = 0; i < lap.length; i++) {
      if (buildingMask[i] === 1) {
        lapStd += (lap[i] - lapMean) ** 2;
      }
    }
    lapStd = lapCount > 1 ? Math.sqrt(lapStd / (lapCount - 1)) : 1;

    const ridgeThreshold = lapMean - 1.0 * lapStd; // negative Laplacian = ridges/hips
    const valleyThreshold = lapMean + 1.0 * lapStd; // positive Laplacian = valleys

    // 7c. Build binary masks for ridge candidates and valley candidates
    const ridgeBinary = new Uint8Array(width * height);
    const valleyBinary = new Uint8Array(width * height);
    for (let i = 0; i < lap.length; i++) {
      if (buildingMask[i] !== 1) continue;
      if (lap[i] < ridgeThreshold) ridgeBinary[i] = 1;
      if (lap[i] > valleyThreshold) valleyBinary[i] = 1;
    }

    // 7d. Connected components
    const ridgeCC = connectedComponents4(ridgeBinary, width, height);
    const valleyCC = connectedComponents4(valleyBinary, width, height);

    // 8. Collect pixels per component, PCA fit, classify
    const lines: DiagramLine[] = [];

    // Minimum segment length
    const minFt = 5;

    // Major axis angle from building outline
    const majorAxisAngle = buildingMajorAxisAngle(boundaryPixels);

    // Process ridge/hip components (negative Laplacian)
    const ridgePixelMap = gatherByLabel(ridgeCC.labels, ridgeCC.count, width);
    let ridgeKept = 0, ridgeRejectedPoly = 0, ridgeRejectedLen = 0;
    for (const [, pixels] of ridgePixelMap) {
      if (pixels.length < 10) continue;
      const fit = pcaLine(pixels);
      if (!fit) continue;
      const { cx, cy, dx, dy } = fit;
      const ep = lineEndpoints(pixels, cx, cy, dx, dy);
      const startPt = pixelToFt(ep.r1, ep.c1, meta);
      const endPt = pixelToFt(ep.r2, ep.c2, meta);
      const lengthFt = distFt(startPt, endPt);
      if (lengthFt < minFt) { ridgeRejectedLen++; continue; }

      // Clip to building polygon — trims any portion extending outside
      const clipped = clipSegmentToPolygon(startPt, endPt, outlineFt);
      if (!clipped) { ridgeRejectedPoly++; continue; }
      const [clippedStart, clippedEnd] = clipped;
      const clippedLen = distFt(clippedStart, clippedEnd);
      if (clippedLen < minFt) { ridgeRejectedLen++; continue; }

      // Classify as ridge vs hip based on elevation difference at endpoints
      const r1c = Math.round(ep.r1) * width + Math.round(ep.c1);
      const r2c = Math.round(ep.r2) * width + Math.round(ep.c2);
      const elev1 = dsmData[Math.max(0, Math.min(r1c, dsmData.length - 1))];
      const elev2 = dsmData[Math.max(0, Math.min(r2c, dsmData.length - 1))];
      const type: "ridge" | "hip" = Math.abs(elev1 - elev2) > 0.5 ? "hip" : "ridge";

      ridgeKept++;
      lines.push({ type, start: clippedStart, end: clippedEnd, lengthFt: clippedLen });
    }
    console.log(`Ridge/hip: kept=${ridgeKept}, rejected by polygon=${ridgeRejectedPoly}, rejected by length=${ridgeRejectedLen}`);

    // Process valley components (positive Laplacian)
    const valleyPixelMap = gatherByLabel(valleyCC.labels, valleyCC.count, width);
    let valleyKept = 0, valleyRejectedPoly = 0, valleyRejectedLen = 0;
    for (const [, pixels] of valleyPixelMap) {
      if (pixels.length < 10) continue;
      const fit = pcaLine(pixels);
      if (!fit) continue;
      const { cx, cy, dx, dy } = fit;
      const ep = lineEndpoints(pixels, cx, cy, dx, dy);
      const startPt = pixelToFt(ep.r1, ep.c1, meta);
      const endPt = pixelToFt(ep.r2, ep.c2, meta);
      const lengthFt = distFt(startPt, endPt);
      if (lengthFt < minFt) { valleyRejectedLen++; continue; }

      // Clip to building polygon — trims any portion extending outside
      const clipped = clipSegmentToPolygon(startPt, endPt, outlineFt);
      if (!clipped) { valleyRejectedPoly++; continue; }
      const [clippedStart, clippedEnd] = clipped;
      const clippedLen = distFt(clippedStart, clippedEnd);
      if (clippedLen < minFt) { valleyRejectedLen++; continue; }

      valleyKept++;
      lines.push({ type: "valley", start: clippedStart, end: clippedEnd, lengthFt: clippedLen });
    }
    console.log(`Valley: kept=${valleyKept}, rejected by polygon=${valleyRejectedPoly}, rejected by length=${valleyRejectedLen}`);

    // 9. Perimeter edges — classify as eave or rake
    for (let i = 0; i < outlineFt.length; i++) {
      const startPt = outlineFt[i];
      const endPt = outlineFt[(i + 1) % outlineFt.length];
      const lengthFt = distFt(startPt, endPt);
      if (lengthFt < minFt) continue;
      const type = classifyEdge(startPt, endPt, majorAxisAngle);
      lines.push({ type, start: startPt, end: endPt, lengthFt });
    }

    // 10. Compute totals
    const totals = { ridge: 0, hip: 0, valley: 0, eave: 0, rake: 0 };
    for (const line of lines) {
      totals[line.type] += line.lengthFt;
    }
    // Round totals
    for (const k of Object.keys(totals) as Array<keyof typeof totals>) {
      totals[k] = Math.round(totals[k] * 10) / 10;
    }

    return { lines, outlineFt, widthFt, heightFt, totals };
  } catch (err) {
    console.error("buildRoofDiagram error:", err);
    return null;
  }
}
