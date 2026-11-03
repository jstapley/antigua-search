import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
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
    month: "short",
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

export default async function EstimatesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const estimates = await prisma.estimate.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Estimates</h1>
          <p className="text-slate-500 mt-1">
            {estimates.length} estimate{estimates.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/estimates/new"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Estimate
        </Link>
      </div>

      {estimates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No estimates yet
          </h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Get started by creating your first AI-powered roofing estimate. Just
            enter a property address.
          </p>
          <Link
            href="/estimates/new"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Estimate
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Roof Area
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Low Estimate
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    High Estimate
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estimates.map((estimate) => {
                  const cfg =
                    statusConfig[
                      estimate.status as keyof typeof statusConfig
                    ] || statusConfig.PENDING;
                  const StatusIcon = cfg.icon;

                  return (
                    <tr
                      key={estimate.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900 max-w-xs truncate">
                          {estimate.address}
                        </p>
                        {estimate.roofType && (
                          <p className="text-xs text-slate-400 mt-0.5 capitalize">
                            {estimate.roofType} roof · {estimate.pitch}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {formatDate(estimate.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">
                          {estimate.roofAreaSqft
                            ? `${estimate.roofAreaSqft.toLocaleString()} sqft`
                            : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          {formatCurrency(estimate.lowEstimate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">
                          {formatCurrency(estimate.highEstimate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/estimates/${estimate.id}`}
                          className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium"
                        >
                          View <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
