import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont, PDFImage } from "pdf-lib";
import type { RoofDiagramData, DiagramLine } from "./dataLayers";

// ── Colour palette ──────────────────────────────────────────────────────────
const C = {
  navy:     rgb(0.06, 0.09, 0.16),   // #0f172a
  blue:     rgb(0.10, 0.34, 0.86),   // #1a56db
  blueLight:rgb(0.93, 0.96, 1.00),   // #eff6ff
  white:    rgb(1.00, 1.00, 1.00),
  s900:     rgb(0.05, 0.08, 0.17),
  s700:     rgb(0.20, 0.25, 0.35),
  s500:     rgb(0.39, 0.45, 0.55),
  s300:     rgb(0.79, 0.84, 0.90),
  s200:     rgb(0.88, 0.91, 0.95),
  s100:     rgb(0.95, 0.96, 0.98),
  green:    rgb(0.08, 0.50, 0.34),
  amber:    rgb(0.77, 0.55, 0.05),
};

const W = 612;   // page width  (US Letter)
const H = 792;   // page height
const M = 45;    // margin
const CW = W - M * 2; // content width = 522

interface Fonts { bold: PDFFont; regular: PDFFont; }

interface EstimateData {
  id: string;
  address: string;
  lat?: number | null;
  lng?: number | null;
  roofAreaSqft?: number | null;
  roofType?: string | null;
  pitch?: string | null;
  complexity?: string | null;
  stories?: number | null;
  lowEstimate?: number | null;
  highEstimate?: number | null;
  aiNotes?: string | null;
  imageUrl?: string | null;
  dataSource?: string | null;
  facetCount?: number | null;
  predominantPitch?: string | null;
  pitchBreakdown?: { pitch: string; areaFt2: number; pct: number }[] | null;
  createdAt: Date;
  diagram?: RoofDiagramData | null;
}

// ── Low-level draw helpers ───────────────────────────────────────────────────

function drawRect(
  page: PDFPage,
  x: number, y: number, w: number, h: number,
  fill: ReturnType<typeof rgb>,
  borderColor?: ReturnType<typeof rgb>,
  borderWidth = 1,
) {
  page.drawRectangle({
    x, y: y - h, width: w, height: h,
    color: fill,
    ...(borderColor ? { borderColor, borderWidth } : {}),
  });
}

function drawText(
  page: PDFPage,
  text: string,
  x: number, y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb> = C.s900,
  maxWidth?: number,
) {
  let safeText = text;
  if (maxWidth) {
    // Truncate if needed
    while (safeText.length > 3 && font.widthOfTextAtSize(safeText, size) > maxWidth) {
      safeText = safeText.slice(0, -4) + "…";
    }
  }
  page.drawText(safeText, { x, y, size, font, color });
}

function drawLine(
  page: PDFPage,
  x1: number, y1: number, x2: number, y2: number,
  color: ReturnType<typeof rgb> = C.s200,
  thickness = 0.5,
) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
}

// ── Page chrome ──────────────────────────────────────────────────────────────

function addPageHeader(page: PDFPage, fonts: Fonts, subtitle: string) {
  // Navy bar
  drawRect(page, 0, H, W, 36, C.navy);
  drawText(page, "RoofAI", M, H - 23, 13, fonts.bold, C.white);
  drawText(page, "Roof Measurement Report", M + 60, H - 23, 10, fonts.regular, C.s300);
  // Right-align subtitle
  const subW = fonts.regular.widthOfTextAtSize(subtitle, 9);
  drawText(page, subtitle, W - M - subW, H - 23, 9, fonts.regular, C.s300);
}

function addPageFooter(page: PDFPage, fonts: Fonts, address: string, pageNum: number, total: number) {
  drawLine(page, M, 36, W - M, 36);
  drawText(page, address, M, 24, 7, fonts.regular, C.s500, CW - 60);
  const pStr = `Page ${pageNum} of ${total}`;
  const pW = fonts.regular.widthOfTextAtSize(pStr, 7);
  drawText(page, pStr, W - M - pW, 24, 7, fonts.regular, C.s500);
  drawText(page, "© RoofAI — For professional use only", M, 14, 7, fonts.regular, C.s300);
}

// ── Section heading ──────────────────────────────────────────────────────────

function sectionHeading(page: PDFPage, fonts: Fonts, y: number, title: string): number {
  drawRect(page, M, y, CW, 22, C.blueLight);
  drawText(page, title, M + 8, y - 14, 10, fonts.bold, C.blue);
  return y - 30;
}

// ── Table helpers ────────────────────────────────────────────────────────────

function tableHeader(
  page: PDFPage, fonts: Fonts,
  y: number, cols: { label: string; x: number; w: number; align?: "left" | "right" }[],
): number {
  drawRect(page, M, y, CW, 18, C.s100);
  for (const col of cols) {
    const tw = fonts.bold.widthOfTextAtSize(col.label, 7.5);
    const tx = col.align === "right" ? col.x + col.w - tw - 4 : col.x + 4;
    drawText(page, col.label, tx, y - 11, 7.5, fonts.bold, C.s500);
  }
  return y - 18;
}

function tableRow(
  page: PDFPage, fonts: Fonts,
  y: number, rowH: number,
  cols: { label: string; x: number; w: number; align?: "left" | "right"; bold?: boolean }[],
  shade: boolean,
) {
  if (shade) drawRect(page, M, y, CW, rowH, C.s100);
  for (const col of cols) {
    const font = col.bold ? fonts.bold : fonts.regular;
    const tw = font.widthOfTextAtSize(col.label, 8);
    const tx = col.align === "right" ? col.x + col.w - tw - 4 : col.x + 4;
    drawText(page, col.label, tx, y - Math.round(rowH / 2) - 3, 8, font, col.bold ? C.s900 : C.s700, col.w - 8);
  }
  drawLine(page, M, y - rowH, W - M, y - rowH, C.s200, 0.3);
  return y - rowH;
}

// ── Fetch satellite image ────────────────────────────────────────────────────

async function fetchSatelliteImage(pdfDoc: PDFDocument, imageUrl: string): Promise<PDFImage | null> {
  try {
    const res = await fetch(imageUrl);
    const buf = await res.arrayBuffer();
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("png")) return pdfDoc.embedPng(buf);
    return pdfDoc.embedJpg(buf);
  } catch {
    return null;
  }
}

// ── Format helpers ───────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Main export ──────────────────────────────────────────────────────────────

export async function generateEstimatePdf(estimate: EstimateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fonts: Fonts = { bold, regular };

  const reportDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "long", day: "numeric",
  }).format(new Date(estimate.createdAt));

  const shortId = estimate.id.slice(-8).toUpperCase();
  const area = estimate.roofAreaSqft ?? 0;
  const pitchBreakdown = estimate.pitchBreakdown ?? [];
  const hasSolar = estimate.dataSource === "solar_api";

  // Pre-fetch satellite image
  const satImage = estimate.imageUrl
    ? await fetchSatelliteImage(pdfDoc, estimate.imageUrl)
    : null;

  const diagram = estimate.diagram ?? null;
  const TOTAL_PAGES = diagram ? 5 : 4;

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 1 — Cover / Summary
  // ════════════════════════════════════════════════════════════════════════════
  {
    const page = pdfDoc.addPage([W, H]);
    addPageHeader(page, fonts, `Report: ${shortId}`);
    addPageFooter(page, fonts, estimate.address, 1, TOTAL_PAGES);

    let y = H - 55;

    // Title block
    drawText(page, "Roof Measurement Report", M, y, 18, bold, C.navy);
    y -= 20;
    drawText(page, reportDate, M, y, 10, regular, C.s500);
    y -= 8;
    drawLine(page, M, y, W - M, y, C.s200);
    y -= 16;

    // Address banner
    drawRect(page, M, y, CW, 40, C.navy);
    drawText(page, estimate.address, M + 12, y - 13, 11, bold, C.white, CW - 24);
    if (estimate.lat && estimate.lng) {
      drawText(
        page,
        `${estimate.lat.toFixed(6)}, ${estimate.lng.toFixed(6)}`,
        M + 12, y - 28, 8, regular, C.s300,
      );
    }
    y -= 56;

    // Two-column layout: Roof Details | Report Contents
    const COL1 = M;
    const COL2 = M + CW * 0.55 + 12;
    const COL1W = CW * 0.55;
    const COL2W = CW * 0.45 - 12;

    // Roof Details box
    drawRect(page, COL1, y, COL1W, 20, C.blue);
    drawText(page, "ROOF DETAILS", COL1 + 8, y - 13, 8.5, bold, C.white);
    y -= 20;

    const details: [string, string][] = [
      ["Total Area", area ? `${fmt(area)} sq ft` : "—"],
      ["Total Roof Facets", estimate.facetCount ? `${estimate.facetCount}` : "—"],
      ["Predominant Pitch", estimate.predominantPitch ?? estimate.pitch ?? "—"],
      ["Number of Stories", estimate.stories ? `${estimate.stories}` : "—"],
      ["Roof Type", estimate.roofType ? capitalize(estimate.roofType) : "—"],
      ["Complexity", estimate.complexity ? capitalize(estimate.complexity) : "—"],
      ["Data Source", hasSolar ? "Google Solar API" : "AI Vision (rural coverage)"],
    ];

    const rowH = 18;
    details.forEach(([label, value], i) => {
      if (i % 2 === 0) drawRect(page, COL1, y, COL1W, rowH, C.s100);
      drawText(page, label, COL1 + 8, y - 11, 8, regular, C.s500);
      drawText(page, value, COL1 + COL1W / 2, y - 11, 8, bold, C.s900, COL1W / 2 - 8);
      drawLine(page, COL1, y - rowH, COL1 + COL1W, y - rowH, C.s200, 0.3);
      y -= rowH;
    });

    // Report Contents (right column)
    let ry = H - 55 - 20 - 8 - 16 - 56 - 20;
    drawRect(page, COL2, ry, COL2W, 20, C.blue);
    drawText(page, "REPORT CONTENTS", COL2 + 8, ry - 13, 8.5, bold, C.white);
    ry -= 20;

    const contents = [
      ["1", "Cover & Summary"],
      ["2", "Satellite Image"],
      ["3", "Areas per Pitch"],
      ["4", "Waste & Cost Estimate"],
    ];
    contents.forEach(([num, title], i) => {
      if (i % 2 === 0) drawRect(page, COL2, ry, COL2W, 18, C.s100);
      drawText(page, num, COL2 + 8, ry - 11, 8, bold, C.blue);
      drawText(page, title, COL2 + 20, ry - 11, 8, regular, C.s700);
      ry -= 18;
    });

    // Satellite thumbnail (right side, below contents)
    if (satImage) {
      const thumbY = ry - 12;
      const thumbH = 130;
      page.drawImage(satImage, {
        x: COL2, y: thumbY - thumbH,
        width: COL2W, height: thumbH,
      });
      page.drawRectangle({
        x: COL2, y: thumbY - thumbH,
        width: COL2W, height: thumbH,
        borderColor: C.s200, borderWidth: 0.5,
      });
    }

    // AI Notes
    if (estimate.aiNotes) {
      y -= 12;
      drawRect(page, M, y, CW, 16, C.blueLight);
      drawText(page, "AI NOTES", M + 8, y - 10, 7.5, bold, C.blue);
      y -= 16;
      drawText(page, estimate.aiNotes, M + 8, y - 11, 8, regular, C.s700, CW - 16);
      y -= 20;
    }

    // Estimate range banner
    y -= 8;
    drawRect(page, M, y, CW, 56, C.navy);
    drawText(page, "ESTIMATED REPLACEMENT COST", M + CW / 2 - 70, y - 10, 8, regular, C.s300);
    if (estimate.lowEstimate && estimate.highEstimate) {
      const rangeText = `${fmtCurrency(estimate.lowEstimate)}  –  ${fmtCurrency(estimate.highEstimate)}`;
      const rw = bold.widthOfTextAtSize(rangeText, 16);
      drawText(page, rangeText, M + (CW - rw) / 2, y - 28, 16, bold, C.white);
    }
    drawText(page, "Based on current material and labor rates · Field verification recommended", M + CW / 2 - 110, y - 46, 7.5, regular, C.s300);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 2 — Satellite Image
  // ════════════════════════════════════════════════════════════════════════════
  {
    const page = pdfDoc.addPage([W, H]);
    addPageHeader(page, fonts, `Report: ${shortId}`);
    addPageFooter(page, fonts, estimate.address, 2, TOTAL_PAGES);

    let y = H - 55;
    y = sectionHeading(page, fonts, y, "Satellite Imagery");

    if (satImage) {
      const imgH = 420;
      const imgW = CW;
      page.drawImage(satImage, { x: M, y: y - imgH, width: imgW, height: imgH });
      page.drawRectangle({ x: M, y: y - imgH, width: imgW, height: imgH, borderColor: C.s300, borderWidth: 0.5 });
      y -= imgH + 12;
    } else {
      drawRect(page, M, y, CW, 200, C.s100);
      drawText(page, "Satellite image unavailable", M + CW / 2 - 50, y - 95, 10, regular, C.s500);
      y -= 212;
    }

    // Caption
    drawText(page, `Property: ${estimate.address}`, M, y - 8, 8, regular, C.s500, CW);
    if (estimate.lat && estimate.lng) {
      drawText(page, `Coordinates: ${estimate.lat.toFixed(6)}, ${estimate.lng.toFixed(6)}`, M, y - 20, 8, regular, C.s500);
    }
    drawText(page, `Imagery source: Google Maps Static API  ·  Analysis: ${hasSolar ? "Google Solar API" : "AI Vision"}`, M, y - 32, 8, regular, C.s500);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 3 — Areas per Pitch
  // ════════════════════════════════════════════════════════════════════════════
  {
    const page = pdfDoc.addPage([W, H]);
    addPageHeader(page, fonts, `Report: ${shortId}`);
    addPageFooter(page, fonts, estimate.address, 3, TOTAL_PAGES);

    let y = H - 55;
    y = sectionHeading(page, fonts, y, "Areas per Pitch");

    // Info note
    drawText(page, "Pitch values shown in inches per foot (X/12). Area measured per pitch group across all facets.", M, y - 6, 8, regular, C.s500);
    y -= 22;

    // Table columns
    const cols = [
      { label: "PITCH",        x: M,         w: 90  },
      { label: "AREA (SQ FT)", x: M + 90,    w: 100, align: "right" as const },
      { label: "% OF ROOF",    x: M + 190,   w: 80,  align: "right" as const },
      { label: "DISTRIBUTION", x: M + 270,   w: CW - 270 },
    ];

    y = tableHeader(page, fonts, y, cols);

    if (pitchBreakdown.length > 0) {
      pitchBreakdown.forEach((row, i) => {
        // Bar
        const barMaxW = CW - 270 - 8;
        const barW = Math.round((row.pct / 100) * barMaxW);

        tableRow(page, fonts, y, 18, [
          { label: row.pitch, x: M, w: 90, bold: true },
          { label: fmt(row.areaFt2), x: M + 90, w: 100, align: "right" },
          { label: `${row.pct}%`,   x: M + 190, w: 80,  align: "right" },
          { label: "", x: M + 270, w: CW - 270 },
        ], i % 2 === 1);

        // Draw bar manually
        if (barW > 0) {
          drawRect(page, M + 274, y - 6, barW, 8, C.blue);
        }
        y -= 18;
      });

      // Total row
      drawRect(page, M, y, CW, 20, C.navy);
      drawText(page, "TOTAL", M + 4, y - 13, 8.5, bold, C.white);
      const totalW = bold.widthOfTextAtSize(fmt(area), 8.5);
      drawText(page, fmt(area), M + 90 + 100 - totalW - 4, y - 13, 8.5, bold, C.white);
      const pctW = bold.widthOfTextAtSize("100%", 8.5);
      drawText(page, "100%", M + 190 + 80 - pctW - 4, y - 13, 8.5, bold, C.white);
      y -= 28;
    } else {
      drawText(page, "Pitch breakdown requires Google Solar API coverage for this address.", M + 8, y - 12, 9, regular, C.s500);
      y -= 30;
    }

    // Pitch table note
    y -= 8;
    drawRect(page, M, y, CW, 30, C.blueLight);
    drawText(page, "Note:", M + 8, y - 11, 8, bold, C.blue);
    drawText(page, `Predominant pitch: ${estimate.predominantPitch ?? "—"}  ·  Total facets: ${estimate.facetCount ?? "—"}  ·  Data source: ${hasSolar ? "Google Solar API" : "AI Vision"}`, M + 40, y - 11, 8, regular, C.s700);
    drawText(page, "EagleView recommends field verifying pitch measurements.", M + 8, y - 22, 8, regular, C.s500);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 4 — Waste Calculation + Cost Estimate
  // ════════════════════════════════════════════════════════════════════════════
  {
    const page = pdfDoc.addPage([W, H]);
    addPageHeader(page, fonts, `Report: ${shortId}`);
    addPageFooter(page, fonts, estimate.address, 4, TOTAL_PAGES);

    let y = H - 55;
    y = sectionHeading(page, fonts, y, "Waste Calculation Table");

    drawText(page, "Total roof area with waste factor applied. One square = 100 sq ft of roofing material.", M, y - 6, 8, regular, C.s500);
    y -= 22;

    const wasteCols = [
      { label: "WASTE %",      x: M,       w: 120 },
      { label: "AREA (SQ FT)", x: M + 120, w: 140, align: "right" as const },
      { label: "SQUARES",      x: M + 260, w: 100, align: "right" as const },
      { label: "NOTE",         x: M + 360, w: CW - 360 },
    ];
    y = tableHeader(page, fonts, y, wasteCols);

    const wasteRows = [
      { pct: 0,  note: "" },
      { pct: 10, note: "" },
      { pct: 12, note: "Recommended" },
      { pct: 15, note: "" },
      { pct: 17, note: "" },
      { pct: 20, note: "Complex roofs" },
    ];

    wasteRows.forEach((row, i) => {
      const wasteArea = Math.round(area * (1 + row.pct / 100));
      const squares = (wasteArea / 100).toFixed(1);
      const isRec = row.pct === 12;
      if (isRec) drawRect(page, M, y, CW, 18, C.blueLight);

      tableRow(page, fonts, y, 18, [
        { label: `${row.pct}%`, x: M, w: 120, bold: isRec },
        { label: fmt(wasteArea), x: M + 120, w: 140, align: "right", bold: isRec },
        { label: squares, x: M + 260, w: 100, align: "right", bold: isRec },
        { label: row.note, x: M + 360, w: CW - 360 },
      ], !isRec && i % 2 === 1);

      y -= 18;
    });

    y -= 20;
    y = sectionHeading(page, fonts, y, "Cost Estimate");

    const low  = estimate.lowEstimate  ?? 0;
    const high = estimate.highEstimate ?? 0;
    const mid  = (low + high) / 2;

    // Big range display
    drawRect(page, M, y, CW, 54, C.navy);
    drawText(page, "ESTIMATED REPLACEMENT COST", M + 12, y - 12, 8, regular, C.s300);
    const rangeStr = `${fmtCurrency(low)}  –  ${fmtCurrency(high)}`;
    const rw = bold.widthOfTextAtSize(rangeStr, 18);
    drawText(page, rangeStr, M + (CW - rw) / 2, y - 32, 18, bold, C.white);
    y -= 62;

    // Cost breakdown table
    y -= 8;
    const matAmt   = Math.round(mid * 0.55 / 50) * 50;
    const laborAmt = Math.round(mid * 0.35 / 50) * 50;
    const ovhAmt   = Math.round(mid - matAmt - laborAmt);

    const costCols = [
      { label: "COMPONENT",     x: M,       w: 240 },
      { label: "AMOUNT",        x: M + 240, w: 100, align: "right" as const },
      { label: "% OF TOTAL",    x: M + 340, w: 80,  align: "right" as const },
      { label: "",              x: M + 420, w: CW - 420 },
    ];
    y = tableHeader(page, fonts, y, costCols);

    [
      { label: "Materials (shingles, underlayment, flashing)", amount: matAmt,   pct: Math.round(matAmt / mid * 100)   },
      { label: "Labor (removal, installation, cleanup)",       amount: laborAmt, pct: Math.round(laborAmt / mid * 100) },
      { label: "Overhead (permits, equipment, warranty)",      amount: ovhAmt,   pct: Math.round(ovhAmt / mid * 100)   },
    ].forEach((row, i) => {
      const barW = Math.round((row.pct / 100) * (CW - 420 - 8));
      tableRow(page, fonts, y, 18, [
        { label: row.label,          x: M,       w: 240 },
        { label: fmtCurrency(row.amount), x: M + 240, w: 100, align: "right" },
        { label: `${row.pct}%`,      x: M + 340, w: 80,  align: "right" },
        { label: "",                 x: M + 420, w: CW - 420 },
      ], i % 2 === 1);
      if (barW > 0) drawRect(page, M + 424, y - 6, barW, 8, C.blue);
      y -= 18;
    });

    // Total
    drawRect(page, M, y, CW, 20, C.s900);
    drawText(page, "ESTIMATED TOTAL (MIDPOINT)", M + 4, y - 13, 8.5, bold, C.white);
    const totW = bold.widthOfTextAtSize(fmtCurrency(mid), 8.5);
    drawText(page, fmtCurrency(mid), M + 240 + 100 - totW - 4, y - 13, 8.5, bold, C.white);
    y -= 30;

    // Disclaimer
    y -= 8;
    drawRect(page, M, y, CW, 50, rgb(1.0, 0.97, 0.91));
    page.drawRectangle({ x: M, y: y - 50, width: CW, height: 50, borderColor: rgb(0.85, 0.70, 0.20), borderWidth: 0.5 });
    drawText(page, "DISCLAIMER", M + 8, y - 8, 8, bold, C.amber);
    drawText(page, "This estimate is generated using satellite imagery analysis and AI. Actual costs may vary based", M + 8, y - 20, 7.5, regular, C.s700, CW - 16);
    drawText(page, "on local labor rates, material choices, roof condition, and contractor pricing. Field verification", M + 8, y - 31, 7.5, regular, C.s700, CW - 16);
    drawText(page, "of all measurements is strongly recommended before ordering materials or quoting a project.", M + 8, y - 42, 7.5, regular, C.s700, CW - 16);

    // Report summary footer block
    y -= 68;
    drawRect(page, M, y, CW, 22, C.blue);
    drawText(page, "REPORT SUMMARY", M + 8, y - 14, 8, bold, C.white);
    y -= 30;  // 22pt box + 8pt gap

    const summaryItems = [
      `Address: ${estimate.address}`,
      `Report ID: ${shortId}  ·  Generated: ${reportDate}`,
      `Total Area: ${fmt(area)} sq ft  ·  Facets: ${estimate.facetCount ?? "—"}  ·  Pitch: ${estimate.predominantPitch ?? estimate.pitch ?? "—"}`,
      `Data Source: ${hasSolar ? "Google Solar API (measured)" : "AI Vision (estimated)"}`,
    ];
    summaryItems.forEach(item => {
      drawText(page, item, M + 4, y, 8, regular, C.s700, CW - 8);
      y -= 14;
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 5 — Roof Line Diagram (only when DataLayers data is available)
  // ════════════════════════════════════════════════════════════════════════════
  if (diagram) {
    const page = pdfDoc.addPage([W, H]);
    addPageHeader(page, fonts, `Report: ${shortId}`);
    addPageFooter(page, fonts, estimate.address, 5, TOTAL_PAGES);

    let y = H - 55;
    y = sectionHeading(page, fonts, y, "Roof Line Diagram");
    drawText(page, "Line lengths rounded to nearest foot  ·  Source: Google Solar API DataLayers  ·  Field verification recommended", M, y - 6, 7.5, regular, C.s500);
    y -= 20;

    // ── Layout: diagram on left 65%, legend + table on right 35% ──────────────
    const DIAG_W = Math.round(CW * 0.63);
    const LEG_X  = M + DIAG_W + 16;
    const LEG_W  = CW - DIAG_W - 16;
    const availH = y - 60;  // leave room above footer

    // ── Scale diagram to fit ───────────────────────────────────────────────────
    const bldW = diagram.widthFt  || 1;
    const bldH = diagram.heightFt || 1;
    const scale = Math.min(DIAG_W / bldW, availH / bldH) * 0.82;

    const diagCX = M + DIAG_W / 2;
    const diagCY = y - availH / 2;

    function toPdf(pt: { x: number; y: number }) {
      return { x: diagCX + pt.x * scale, y: diagCY + pt.y * scale };
    }

    // Background for diagram area
    drawRect(page, M, y, DIAG_W, availH, C.s100);

    // Building outline (solid dark)
    if (diagram.outlineFt.length > 1) {
      for (let i = 0; i < diagram.outlineFt.length; i++) {
        const a = toPdf(diagram.outlineFt[i]);
        const b = toPdf(diagram.outlineFt[(i + 1) % diagram.outlineFt.length]);
        page.drawLine({ start: { x: a.x, y: a.y }, end: { x: b.x, y: b.y }, thickness: 1.5, color: C.s700 });
      }
    }

    // Line type colors
    const lineColors: Record<DiagramLine["type"], ReturnType<typeof rgb>> = {
      ridge:  rgb(0.78, 0.10, 0.10),
      hip:    rgb(0.12, 0.40, 0.80),
      valley: rgb(0.30, 0.65, 0.90),
      rake:   rgb(0.10, 0.55, 0.22),
      eave:   C.s900,
    };
    const lineThick: Record<DiagramLine["type"], number> = {
      ridge: 2.0, hip: 1.5, valley: 1.5, rake: 1.5, eave: 1.2,
    };

    // Draw ridge/hip/valley/eave/rake lines
    for (const line of diagram.lines) {
      const a = toPdf(line.start);
      const b = toPdf(line.end);
      const color = lineColors[line.type];
      const thick = lineThick[line.type];

      if (line.type === "valley") {
        // Simulate dashed by drawing alternating segments
        const steps = Math.max(2, Math.round(line.lengthFt / 3));
        for (let s = 0; s < steps; s += 2) {
          const t0 = s / steps, t1 = Math.min((s + 1) / steps, 1);
          page.drawLine({
            start: { x: a.x + (b.x - a.x) * t0, y: a.y + (b.y - a.y) * t0 },
            end:   { x: a.x + (b.x - a.x) * t1, y: a.y + (b.y - a.y) * t1 },
            thickness: thick, color,
          });
        }
      } else {
        page.drawLine({ start: { x: a.x, y: a.y }, end: { x: b.x, y: b.y }, thickness: thick, color });
      }

      // Length label on longer segments
      if (line.lengthFt >= 6) {
        const mx = (a.x + b.x) / 2 + 2;
        const my = (a.y + b.y) / 2 + 2;
        drawText(page, `${Math.round(line.lengthFt)}`, mx, my, 6, regular, color);
      }
    }

    // ── Legend ─────────────────────────────────────────────────────────────────
    let ly = y - 4;
    const HDR_H = 20;
    const ROW_H = 17;
    drawRect(page, LEG_X, ly, LEG_W, HDR_H, C.blue);
    drawText(page, "LINE TYPES", LEG_X + 6, ly - 13, 7.5, bold, C.white);
    ly -= HDR_H + 4;

    const legendItems: Array<{ type: DiagramLine["type"]; label: string }> = [
      { type: "ridge",  label: "Ridges" },
      { type: "hip",    label: "Hips" },
      { type: "valley", label: "Valleys" },
      { type: "rake",   label: "Rakes" },
      { type: "eave",   label: "Eaves" },
    ];
    for (const item of legendItems) {
      const color = lineColors[item.type];
      page.drawLine({ start: { x: LEG_X, y: ly - ROW_H / 2 }, end: { x: LEG_X + 18, y: ly - ROW_H / 2 }, thickness: 2, color });
      drawText(page, item.label, LEG_X + 22, ly - 11, 8, regular, C.s700);
      const tot = diagram.totals[item.type];
      const totStr = `= ${Math.round(tot)} ft`;
      const tw = bold.widthOfTextAtSize(totStr, 8);
      drawText(page, totStr, LEG_X + LEG_W - tw - 6, ly - 11, 8, bold, C.s900);
      ly -= ROW_H;
    }

    // ── Length summary table ───────────────────────────────────────────────────
    ly -= 10;
    drawRect(page, LEG_X, ly, LEG_W, HDR_H, C.blue);
    drawText(page, "TOTAL LINE LENGTHS", LEG_X + 6, ly - 13, 7.5, bold, C.white);
    ly -= HDR_H;

    const tableItems: Array<[string, number]> = [
      ["Ridges",  diagram.totals.ridge],
      ["Hips",    diagram.totals.hip],
      ["Valleys", diagram.totals.valley],
      ["Rakes",   diagram.totals.rake],
      ["Eaves",   diagram.totals.eave],
    ];
    const totalFt = Object.values(diagram.totals).reduce((s, v) => s + v, 0);
    tableItems.forEach(([label, val], i) => {
      if (i % 2 === 0) drawRect(page, LEG_X, ly, LEG_W, ROW_H, C.s100);
      drawText(page, label, LEG_X + 4, ly - 11, 8, regular, C.s700);
      const valStr = `${Math.round(val)} ft`;
      const vw = regular.widthOfTextAtSize(valStr, 8);
      drawText(page, valStr, LEG_X + LEG_W - vw - 6, ly - 11, 8, regular, C.s700);
      ly -= ROW_H;
    });
    // Total row
    drawRect(page, LEG_X, ly, LEG_W, HDR_H, C.navy);
    drawText(page, "Total", LEG_X + 4, ly - 13, 8, bold, C.white);
    const totStr = `${Math.round(totalFt)} ft`;
    const ttw = bold.widthOfTextAtSize(totStr, 8);
    drawText(page, totStr, LEG_X + LEG_W - ttw - 6, ly - 13, 8, bold, C.white);
    ly -= HDR_H + 8;

    // ── Building dimensions note ───────────────────────────────────────────────
    drawRect(page, LEG_X, ly, LEG_W, 34, C.blueLight);
    drawText(page, "Building Footprint", LEG_X + 6, ly - 10, 7.5, bold, C.blue);
    drawText(page, `${Math.round(Math.abs(diagram.widthFt))} ft x ${Math.round(Math.abs(diagram.heightFt))} ft (approx)`, LEG_X + 6, ly - 23, 8, regular, C.s700);

    // ── Note ──────────────────────────────────────────────────────────────────
    ly -= 44;
    drawText(page, "Note: Diagram generated from satellite DSM data. Ridge, hip,", LEG_X, ly, 6.5, regular, C.s500, LEG_W);
    ly -= 9;
    drawText(page, "valley and perimeter lines are algorithmically detected.", LEG_X, ly, 6.5, regular, C.s500, LEG_W);
    ly -= 9;
    drawText(page, "Field verification of all measurements is required.", LEG_X, ly, 6.5, regular, C.s500, LEG_W);
  }

  return pdfDoc.save();
}
