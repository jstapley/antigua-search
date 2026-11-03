export interface RoofFacet {
  pitchDegrees: number;
  pitchX12: number;        // e.g. 7
  pitchLabel: string;      // e.g. "7/12"
  azimuthDegrees: number;
  areaMeters2: number;
  areaFt2: number;
}

export interface SolarBuildingData {
  totalAreaFt2: number;
  facets: RoofFacet[];
  facetCount: number;
  predominantPitch: string;     // e.g. "7/12"
  predominantPitchDegrees: number;
  pitchBreakdown: { pitch: string; areaFt2: number; pct: number }[];
}

export async function getSolarBuildingData(
  lat: number,
  lng: number
): Promise<SolarBuildingData | null> {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    const url =
      `https://solar.googleapis.com/v1/buildingInsights:findClosest` +
      `?location.latitude=${lat}&location.longitude=${lng}` +
      `&requiredQuality=LOW&key=${key}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.log("Solar API response:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const segments = data.solarPotential?.roofSegmentStats;
    if (!segments?.length) return null;

    const facets: RoofFacet[] = segments.map((seg: {
      pitchDegrees?: number;
      azimuthDegrees?: number;
      stats?: { areaMeters2?: number };
    }) => {
      const pitchDegrees = seg.pitchDegrees ?? 0;
      const rawX12 = Math.tan((pitchDegrees * Math.PI) / 180) * 12;
      // Clamp: anything < 2/12 = flat, anything > 12/12 stays at 12
      const pitchX12 = rawX12 < 2 ? 0 : Math.min(12, Math.round(rawX12));
      const pitchLabel = pitchX12 === 0 ? "Flat" : `${pitchX12}/12`;
      const areaMeters2 = seg.stats?.areaMeters2 ?? 0;
      return {
        pitchDegrees,
        pitchX12,
        pitchLabel,
        azimuthDegrees: seg.azimuthDegrees ?? 0,
        areaMeters2,
        areaFt2: Math.round(areaMeters2 * 10.7639),
      };
    });

    const totalAreaFt2 = facets.reduce((s, f) => s + f.areaFt2, 0);

    // Build pitch breakdown grouped by pitch label
    const pitchMap: Record<string, number> = {};
    for (const f of facets) {
      pitchMap[f.pitchLabel] = (pitchMap[f.pitchLabel] ?? 0) + f.areaFt2;
    }
    const pitchBreakdown = Object.entries(pitchMap)
      .map(([pitch, areaFt2]) => ({
        pitch,
        areaFt2: Math.round(areaFt2),
        pct: Math.round((areaFt2 / totalAreaFt2) * 100),
      }))
      .sort((a, b) => b.areaFt2 - a.areaFt2);

    const predominantPitch = pitchBreakdown[0].pitch;
    const predominantFacet = facets.find(f => f.pitchLabel === predominantPitch)!;

    return {
      totalAreaFt2: Math.round(totalAreaFt2),
      facets,
      facetCount: facets.length,
      predominantPitch,
      predominantPitchDegrees: predominantFacet.pitchDegrees,
      pitchBreakdown,
    };
  } catch (err) {
    console.error("Solar API error:", err);
    return null;
  }
}
