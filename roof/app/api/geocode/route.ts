import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "REQUEST_DENIED") {
    return NextResponse.json(
      { error: "Google Maps API key is missing or invalid. Add GOOGLE_MAPS_API_KEY to .env.local." },
      { status: 500 }
    );
  }

  if (data.status !== "OK") {
    return NextResponse.json(
      { error: "Address not found. Please try a more specific address." },
      { status: 404 }
    );
  }

  const result = data.results[0];
  return NextResponse.json({
    formattedAddress: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
  });
}
