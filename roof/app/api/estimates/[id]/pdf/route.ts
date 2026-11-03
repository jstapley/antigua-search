import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateEstimatePdf } from "@/lib/pdfGenerator";
import { buildRoofDiagram } from "@/lib/dataLayers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const estimate = await prisma.estimate.findFirst({
    where: { id, userId: session.id },
  });

  if (!estimate) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch DataLayers diagram if we have coordinates (Solar API estimates only)
  let diagram = null;
  if (estimate.lat && estimate.lng && estimate.dataSource === "solar_api") {
    console.log("Fetching DataLayers diagram for PDF...");
    diagram = await buildRoofDiagram(estimate.lat, estimate.lng);
    console.log(diagram
      ? `Diagram: ${diagram.lines.length} lines, ${Math.round(diagram.widthFt)}×${Math.round(diagram.heightFt)} ft`
      : "Diagram: not available");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBytes = await generateEstimatePdf({ ...(estimate as any), diagram });

  const shortId = id.slice(-8);
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="roofai-estimate-${shortId}.pdf"`,
    },
  });
}
