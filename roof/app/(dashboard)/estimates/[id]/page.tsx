import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Home,
  Layers,
  Ruler,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Download,
} from "lucide-react";

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

const statusConfig = {
  COMPLETE: {
    label: "Complete",
    icon: CheckCircle,
    className: "text-green-700 bg-green-50 border-green-200",
  },
  PROCESSING: {
    label: "Processing",
    icon: Clock,
    className: "text-blue-700 bg-blue-50 border-blue-200",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "text-slate-600 bg-slate-100 border-slate-200",
  },
  FAILED: {
    label: "Failed",
    icon: AlertCircle,
    className: "text-red-700 bg-red-50 border-red-200",
  },
};

export default async function EstimateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const estimate = await prisma.estimate.findUnique({
    where: { id },
  });

  if (!estimate || estimate.userId !== session.id) {
    notFound();
  }

  const cfg =
    statusConfig[estimate.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const StatusIcon = cfg.icon;

  const midpoint =
    estimate.lowEstimate && estimate.highEstimate
      ? (estimate.lowEstimate + estimate.highEstimate) / 2
      : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/estimates"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Estimates
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Estimate Report
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin className="w-4 h-4" />
            {estimate.address}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${cfg.className}`}
        >
          <StatusIcon className="w-4 h-4" />
          {cfg.label}
        </span>
      </div>

      <div className="space-y-6">
        {/* Satellite image */}
        {estimate.imageUrl && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="relative h-64 bg-slate-900">
              <Image
                src={estimate.imageUrl}
                alt="Satellite view"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                Satellite Analysis Image
              </div>
            </div>
          </div>
        )}

        {/* Estimate range */}
        {estimate.lowEstimate && estimate.highEstimate && (
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
              AI-generated estimate based on satellite imagery analysis
            </p>
          </div>
        )}

        {/* Details grid */}
        {estimate.status === "COMPLETE" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              Roof Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Roof Area",
                  value: estimate.roofAreaSqft
                    ? `${estimate.roofAreaSqft.toLocaleString()} sqft`
                    : "—",
                  icon: Ruler,
                },
                {
                  label: "Roof Type",
                  value: estimate.roofType
                    ? estimate.roofType.charAt(0).toUpperCase() +
                      estimate.roofType.slice(1)
                    : "—",
                  icon: Home,
                },
                {
                  label: "Pitch",
                  value: estimate.pitch
                    ? estimate.pitch.charAt(0).toUpperCase() +
                      estimate.pitch.slice(1)
                    : "—",
                  icon: Layers,
                },
                {
                  label: "Complexity",
                  value: estimate.complexity
                    ? estimate.complexity.charAt(0).toUpperCase() +
                      estimate.complexity.slice(1)
                    : "—",
                  icon: Layers,
                },
                {
                  label: "Stories",
                  value: estimate.stories
                    ? `${estimate.stories} ${estimate.stories === 1 ? "story" : "stories"}`
                    : "—",
                  icon: Home,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {estimate.aiNotes && (
              <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl">
                <p className="text-xs font-medium text-brand-700 uppercase tracking-wider mb-1">
                  AI Analysis Notes
                </p>
                <p className="text-sm text-slate-700">{estimate.aiNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Cost breakdown */}
        {midpoint && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Cost Breakdown
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-3 text-slate-500 font-medium">
                    Line Item
                  </th>
                  <th className="text-right pb-3 text-slate-500 font-medium">
                    Low
                  </th>
                  <th className="text-right pb-3 text-slate-500 font-medium">
                    High
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  {
                    item: "Materials (shingles, underlayment, flashing)",
                    lowPct: 0.5,
                    highPct: 0.6,
                  },
                  {
                    item: "Labor (tear-off, installation, cleanup)",
                    lowPct: 0.3,
                    highPct: 0.38,
                  },
                  {
                    item: "Overhead (permits, equipment, warranty)",
                    lowPct: 0.1,
                    highPct: 0.12,
                  },
                ].map(({ item, lowPct, highPct }) => (
                  <tr key={item}>
                    <td className="py-3 text-slate-700">{item}</td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      {formatCurrency((estimate.lowEstimate ?? 0) * lowPct)}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      {formatCurrency((estimate.highEstimate ?? 0) * highPct)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <th className="pt-3 text-left font-bold text-slate-900">
                    Total Estimate
                  </th>
                  <th className="pt-3 text-right font-bold text-slate-900">
                    {formatCurrency(estimate.lowEstimate)}
                  </th>
                  <th className="pt-3 text-right font-bold text-slate-900">
                    {formatCurrency(estimate.highEstimate)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            Generated on {formatDate(estimate.createdAt)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Estimate ID: {estimate.id}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-700">
            <strong>Disclaimer:</strong> This AI-generated estimate is for
            informational purposes only. Actual costs may vary based on local
            labor rates, material choices, existing damage, and contractor
            pricing. We recommend obtaining 2–3 in-person quotes before making a
            final decision.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/estimates"
            className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Estimates
          </Link>
          {estimate.status === "COMPLETE" && (
            <a
              href={`/api/estimates/${estimate.id}/pdf`}
              download
              className="flex items-center gap-2 px-5 py-3 border border-brand-200 bg-brand-50 rounded-xl text-brand-700 text-sm font-medium hover:bg-brand-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
          <Link
            href="/estimates/new"
            className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            New Estimate
          </Link>
        </div>
      </div>
    </div>
  );
}
