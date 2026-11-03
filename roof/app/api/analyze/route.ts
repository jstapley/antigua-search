import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSatelliteImageUrl, analyzeRoof } from "@/lib/roofAnalyzer";
import { getSolarBuildingData } from "@/lib/solarApi";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: re-enable limits before going live
    // if (session.estimatesLeft <= 0 && session.plan === "FREE") {
    //   return NextResponse.json({ error: "You've used all your free estimates. Upgrade your plan to continue." }, { status: 403 });
    // }

    const { address, lat, lng } = await req.json();
    if (!address || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Address, lat, and lng are required" },
        { status: 400 }
      );
    }

    const estimate = await prisma.estimate.create({
      data: { userId: session.id, address, lat, lng, status: "PROCESSING" },
    });

    try {
      const imageUrl = getSatelliteImageUrl(lat, lng);

      // Phase 1: Try Solar API for accurate facet data
      const solarData = await getSolarBuildingData(lat, lng);
      console.log(
        solarData
          ? `Solar API: ${solarData.facetCount} facets, ${solarData.totalAreaFt2} sqft, pitch ${solarData.predominantPitch}`
          : "Solar API: no data, falling back to AI vision"
      );

      // Phase 2: AI vision for roof type, complexity, stories, notes
      // Pass solar area so GPT-4o doesn't need to guess sq footage
      const analysis = await analyzeRoof(imageUrl, address, solarData?.totalAreaFt2);

      const updated = await prisma.estimate.update({
        where: { id: estimate.id },
        data: {
          ...analysis,
          imageUrl,
          status: "COMPLETE",
          // Override with Solar API data when available
          ...(solarData && {
            dataSource: "solar_api",
            roofAreaSqft: solarData.totalAreaFt2,
            facetCount: solarData.facetCount,
            predominantPitch: solarData.predominantPitch,
            facetsJson: solarData.facets as object[],
            pitchBreakdown: solarData.pitchBreakdown as object[],
          }),
          ...(!solarData && { dataSource: "ai_vision" }),
        },
      });

      // TODO: re-enable before going live
      // if (session.plan === "FREE") {
      //   await prisma.user.update({ where: { id: session.id }, data: { estimatesLeft: { decrement: 1 } } });
      // }

      return NextResponse.json(updated);
    } catch (analysisError) {
      console.error("Analysis error:", analysisError);
      await prisma.estimate.update({
        where: { id: estimate.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json(
        { error: "AI analysis failed. Please try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
