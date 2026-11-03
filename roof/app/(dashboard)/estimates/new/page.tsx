"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Search,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Home,
  Layers,
  Ruler,
  AlertCircle,
  Zap,
  Download,
} from "lucide-react";

interface GeocodeResult {
  formattedAddress: string;
  lat: number;
  lng: number;
}

interface PitchRow {
  pitch: string;
  areaFt2: number;
  pct: number;
}

interface EstimateResult {
  id: string;
  address: string;
  roofAreaSqft: number;
  roofType: string;
  pitch: string;
  complexity: string;
  stories: number;
  lowEstimate: number;
  highEstimate: number;
  aiNotes: string;
  imageUrl: string;
  dataSource?: string;
  facetCount?: number;
  predominantPitch?: string;
  pitchBreakdown?: PitchRow[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSatellitePreviewUrl(lat: number, lng: number) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=640x400&maptype=satellite&key=${key}`;
}

type Step = "address" | "confirm" | "results";

export default function NewEstimatePage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [addressInput, setAddressInput] = useState("");
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(null);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  const [geocoding, setGeocoding] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const [analyzeError, setAnalyzeError] = useState("");

  // ── Step 1: Geocode the address ──
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!addressInput.trim()) return;

    setGeocoding(true);
    setGeocodeError("");

    try {
      const res = await fetch(
        `/api/geocode?address=${encodeURIComponent(addressInput)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setGeocodeError(data.error || "Address not found");
        return;
      }

      setGeocodeResult(data);
      setStep("confirm");
    } catch {
      setGeocodeError("Failed to look up address. Please try again.");
    } finally {
      setGeocoding(false);
    }
  }

  // ── Step 2: Run AI analysis ──
  async function handleAnalyze() {
    if (!geocodeResult) return;

    setAnalyzing(true);
    setAnalyzeError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: geocodeResult.formattedAddress,
          lat: geocodeResult.lat,
          lng: geocodeResult.lng,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAnalyzeError(data.error || "Analysis failed. Please try again.");
        return;
      }

      setEstimate(data);
      setStep("results");
    } catch {
      setAnalyzeError("Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function handleStartNew() {
    router.replace("/estimates/new");
    setStep("address");
    setAddressInput("");
    setGeocodeResult(null);
    setEstimate(null);
    setGeocodeError("");
    setAnalyzeError("");
  }

  // ── Pricing breakdown ──
  function getCostBreakdown(result: EstimateResult) {
    const midpoint = (result.lowEstimate + result.highEstimate) / 2;
    const materials = Math.round((midpoint * 0.55) / 50) * 50;
    const labor = Math.round((midpoint * 0.35) / 50) * 50;
    const overhead = midpoint - materials - labor;
    return { materials, labor, overhead };
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Estimate</h1>
        <p className="text-slate-500 mt-1">
          AI-powered roofing analysis from satellite imagery
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {(["address", "confirm", "results"] as Step[]).map((s, i) => {
          const labels = ["Enter Address", "Confirm & Analyze", "Results"];
          const active = step === s;
          const done =
            (step === "confirm" && i === 0) ||
            (step === "results" && i <= 1);
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-brand-600 text-white"
                    : active
                    ? "bg-brand-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  active ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {labels[i]}
              </span>
              {i < 2 && (
                <div className="w-8 h-0.5 bg-slate-200 mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Address Entry ── */}
      {step === "address" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Enter the property address
            </h2>
            <p className="text-slate-500 text-sm">
              We&apos;ll pull satellite imagery and analyze the roof structure
              automatically.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {geocodeError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {geocodeError}
              </div>
            )}

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="123 Main Street, Springfield, IL 62701"
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent text-sm transition-all"
                disabled={geocoding}
              />
            </div>

            <button
              type="submit"
              disabled={geocoding || !addressInput.trim()}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
              {geocoding ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Looking up address...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search Address
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 text-center">
              Works best with full addresses including city and country. Example: 25 Main St, Springfield, IL or 25 Main St, Toronto, ON, Canada
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Confirm & Analyze ── */}
      {step === "confirm" && geocodeResult && (
        <div className="space-y-6">
          {/* Satellite preview */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="relative h-72 bg-slate-900">
              <Image
                src={getSatellitePreviewUrl(geocodeResult.lat, geocodeResult.lng)}
                alt="Satellite view"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Satellite View
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1">
                    Property Address
                  </p>
                  <p className="font-semibold text-slate-900">
                    {geocodeResult.formattedAddress}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {geocodeResult.lat.toFixed(6)}, {geocodeResult.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI info card */}
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  What our AI will analyze
                </h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    Roof area in square feet
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    Roof type, pitch, and complexity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    Number of stories
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    Cost estimate with material/labor breakdown
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {analyzeError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {analyzeError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleStartNew}
              className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Change Address
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI is analyzing your roof...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Roof
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {analyzing && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
                  <Zap className="w-5 h-5 text-brand-600 absolute inset-0 m-auto" />
                </div>
              </div>
              <p className="font-semibold text-slate-900 mb-1">
                Analyzing satellite imagery...
              </p>
              <p className="text-sm text-slate-500">
                GPT-4o is measuring your roof. This usually takes 10–20 seconds.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Results ── */}
      {step === "results" && estimate && (
        <div className="space-y-6">
          {/* Success header */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Analysis Complete</p>
                <p className="text-sm text-green-700">{estimate.address}</p>
              </div>
            </div>
            {/* Data source badge */}
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              estimate.dataSource === "solar_api"
                ? "bg-brand-100 text-brand-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {estimate.dataSource === "solar_api" ? "Google Solar API" : "AI Vision"}
            </span>
          </div>

          {/* Satellite image */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="relative h-56 bg-slate-900">
              <Image
                src={estimate.imageUrl || getSatellitePreviewUrl(0, 0)}
                alt="Analyzed roof"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Estimate range */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
              Estimated Replacement Cost
            </p>
            <div className="text-5xl font-black text-slate-900 mb-2">
              {formatCurrency(estimate.lowEstimate)}{" "}
              <span className="text-slate-400">–</span>{" "}
              {formatCurrency(estimate.highEstimate)}
            </div>
            <p className="text-sm text-slate-400">
              Based on current material and labor rates
            </p>
          </div>

          {/* Roof details grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              Roof Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Total Area", value: `${estimate.roofAreaSqft.toLocaleString()} sqft`, icon: Ruler },
                { label: "Roof Facets", value: estimate.facetCount ? `${estimate.facetCount}` : "—", icon: Layers },
                { label: "Predominant Pitch", value: estimate.predominantPitch ?? estimate.pitch, icon: Layers },
                { label: "Roof Type", value: estimate.roofType.charAt(0).toUpperCase() + estimate.roofType.slice(1), icon: Home },
                { label: "Complexity", value: estimate.complexity.charAt(0).toUpperCase() + estimate.complexity.slice(1), icon: Layers },
                { label: "Stories", value: `${estimate.stories}`, icon: Home },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {estimate.aiNotes && (
              <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl">
                <p className="text-xs font-medium text-brand-700 uppercase tracking-wider mb-1">AI Notes</p>
                <p className="text-sm text-slate-700">{estimate.aiNotes}</p>
              </div>
            )}
          </div>

          {/* Pitch breakdown table — Solar API only */}
          {estimate.pitchBreakdown && estimate.pitchBreakdown.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-brand-600" />
                Areas per Pitch
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Pitch</th>
                    <th className="text-right py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Area (sq ft)</th>
                    <th className="text-right py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">% of Roof</th>
                    <th className="text-right py-2 text-xs text-slate-400 font-medium uppercase tracking-wider w-1/3">Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.pitchBreakdown.map((row) => (
                    <tr key={row.pitch} className="border-b border-slate-50">
                      <td className="py-2.5 font-semibold text-slate-900">{row.pitch}</td>
                      <td className="py-2.5 text-right text-slate-700">{row.areaFt2.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-slate-700">{row.pct}%</td>
                      <td className="py-2.5 pl-4">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${row.pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="pt-3 text-slate-900">Total</td>
                    <td className="pt-3 text-right text-slate-900">{estimate.roofAreaSqft.toLocaleString()}</td>
                    <td className="pt-3 text-right text-slate-900">100%</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Waste calculation table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Waste Calculation</h3>
            <p className="text-xs text-slate-500 mb-3">Material order quantities including waste factor</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Waste %</th>
                  <th className="text-right py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Area (sq ft)</th>
                  <th className="text-right py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Squares</th>
                </tr>
              </thead>
              <tbody>
                {[0, 10, 12, 15, 17, 20].map((waste) => {
                  const area = Math.round(estimate.roofAreaSqft * (1 + waste / 100));
                  const squares = (area / 100).toFixed(1);
                  return (
                    <tr key={waste} className={`border-b border-slate-50 ${waste === 12 ? "bg-brand-50" : ""}`}>
                      <td className="py-2 text-slate-700">{waste}%{waste === 12 ? " (recommended)" : ""}</td>
                      <td className="py-2 text-right text-slate-700">{area.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-slate-900">{squares}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cost breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Cost Breakdown (Midpoint)</h3>
            {(() => {
              const { materials, labor, overhead } = getCostBreakdown(estimate);
              const midpoint = (estimate.lowEstimate + estimate.highEstimate) / 2;
              return (
                <div className="space-y-3">
                  {[
                    { label: "Materials (shingles, underlayment, flashing)", amount: materials, pct: Math.round((materials / midpoint) * 100), color: "bg-brand-600" },
                    { label: "Labor (removal, installation, cleanup)", amount: labor, pct: Math.round((labor / midpoint) * 100), color: "bg-green-500" },
                    { label: "Overhead (permits, equipment, warranty)", amount: overhead, pct: Math.round((overhead / midpoint) * 100), color: "bg-purple-500" },
                  ].map(({ label, amount, pct, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-slate-600">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">{pct}%</span>
                          <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-900">Estimated Total</span>
                    <span className="font-bold text-slate-900">{formatCurrency(midpoint)}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">
              <strong>Disclaimer:</strong> This estimate is for informational purposes only. Actual costs may vary based on local labor rates, material choices, existing damage, and contractor pricing. We recommend obtaining 2–3 in-person quotes before making a final decision.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleStartNew}
              className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              New Estimate
            </button>
            <a
              href={`/api/estimates/${estimate.id}/pdf`}
              download
              className="flex items-center gap-2 px-5 py-3 border border-brand-200 bg-brand-50 rounded-xl text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
            <Link
              href={`/estimates/${estimate.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              View Saved Estimate
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
