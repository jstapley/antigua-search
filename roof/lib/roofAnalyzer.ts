import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface RoofAnalysis {
  roofAreaSqft: number;
  roofType: string;
  pitch: string;
  complexity: string;
  stories: number;
  aiNotes: string;
  lowEstimate: number;
  highEstimate: number;
}

export function getSatelliteImageUrl(lat: number, lng: number): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x640&maptype=satellite&key=${key}`;
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const contentType = res.headers.get("content-type") || "image/png";
  return `data:${contentType};base64,${base64}`;
}

export async function analyzeRoof(
  imageUrl: string,
  address: string,
  knownAreaSqft?: number
): Promise<RoofAnalysis> {
  const base64Image = await fetchImageAsBase64(imageUrl);

  // When Solar API has already given us the area, tell GPT-4o so it focuses
  // on roof type, complexity, stories and notes rather than guessing sqft.
  const areaInstruction = knownAreaSqft
    ? `The roof area has already been measured as ${knownAreaSqft} sq ft by satellite data — use that exact value for roofAreaSqft.`
    : `A typical single-story building footprint is 1,200–2,000 sqft; roof area is 1.1–1.4x footprint depending on pitch. Estimate roofAreaSqft from what is visible.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert roofing contractor and estimator. You analyze aerial/satellite images of buildings to estimate roof characteristics for insurance and construction purposes. Always respond with valid JSON only.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze the roof structure visible in this aerial image of the building at ${address}.

${areaInstruction}

Return a JSON object with these fields:
- roofAreaSqft: total roof surface area in square feet (number)
- roofType: one of "gable", "hip", "flat", "gambrel", "mansard", "shed", "complex"
- pitch: one of "low (2:12-4:12)", "medium (5:12-8:12)", "steep (9:12+)"
- complexity: one of "simple", "moderate", "complex"
- stories: number of stories (1, 2, or 3)
- aiNotes: one sentence describing the roof shape and condition`,
          },
          {
            type: "image_url",
            image_url: { url: base64Image, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.2,
  });

  const text = response.choices[0].message.content || "{}";
  const data = JSON.parse(text.replace(/```json\n?|```\n?/g, "").trim());

  // Use Solar API area when available, otherwise use GPT-4o estimate
  const area = knownAreaSqft ?? data.roofAreaSqft ?? 1500;

  const pitchMultiplier = data.pitch?.includes("steep")
    ? 1.25
    : data.pitch?.includes("medium")
    ? 1.1
    : 1.0;
  const complexityMultiplier =
    data.complexity === "complex" ? 1.3 : data.complexity === "moderate" ? 1.15 : 1.0;
  const storyMultiplier = (data.stories || 1) > 1 ? 1.15 : 1.0;

  const baseMultiplier = pitchMultiplier * complexityMultiplier * storyMultiplier;
  const baseLow = area * 5.5 * baseMultiplier + 750;
  const baseHigh = area * 9.5 * baseMultiplier + 750;

  return {
    roofAreaSqft: Math.round(area),
    roofType: data.roofType || "gable",
    pitch: data.pitch || "medium",
    complexity: data.complexity || "moderate",
    stories: data.stories || 1,
    aiNotes: data.aiNotes || "Roof analysis complete.",
    lowEstimate: Math.round(baseLow / 50) * 50,
    highEstimate: Math.round(baseHigh / 50) * 50,
  };
}
