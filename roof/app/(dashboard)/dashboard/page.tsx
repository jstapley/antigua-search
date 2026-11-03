import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
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
  }).format(new Date(date));
}

const statusConfig = {
  COMPLETE: {
    label: "Complete",
    icon: CheckCircle,
    className: "text-green-600 bg-green-50",
  },
  PROCESSING: {
    label: "Processing",
    icon: Clock,
    className: "text-blue-600 bg-blue-50",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "text-slate-500 bg-slate-100",
  },
  FAILED: {
    label: "Failed",
    icon: AlertCircle,
    className: "text-red-600 bg-red-50",
  },
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const estimates = await prisma.estimate.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
  });

  const thisMonth = estimates.filter((e) => {
    const created = new Date(e.createdAt);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  });

  const completedEstimates = estimates.filter((e) => e.status === "COMPLETE");
  const avgEstimate =
    completedEstimates.length > 0
      ? completedEstimates.reduce(
          (acc, e) =>
            acc + ((e.lowEstimate ?? 0) + (e.highEstimate ?? 0)) / 2,
          0
        ) / completedEstimates.length
      : null;

  const recentEstimates = estimates.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {session.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-slate-500 mt-1">
          Here&apos;s an overview of your roofing estimates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">
              Total Estimates
            </span>
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-brand-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {estimates.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">All time</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">
              This Month
            </span>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {thisMonth.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date()
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">
              Avg. Estimate
            </span>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {avgEstimate ? formatCurrency(avgEstimate) : "—"}
          </div>
          <div className="text-xs text-slate-400 mt-1">Midpoint average</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent estimates */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Estimates</h2>
            <Link
              href="/estimates"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentEstimates.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No estimates yet</p>
              <Link
                href="/estimates/new"
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> Create your first estimate
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEstimates.map((estimate) => {
                const cfg =
                  statusConfig[estimate.status as keyof typeof statusConfig];
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={estimate.id}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {estimate.address}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(estimate.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          {estimate.lowEstimate && estimate.highEstimate ? (
                            <p className="text-sm font-semibold text-slate-900">
                              {formatCurrency(estimate.lowEstimate)} –{" "}
                              {formatCurrency(estimate.highEstimate)}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-400">—</p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        <Link
                          href={`/estimates/${estimate.id}`}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions / CTA */}
        <div className="space-y-4">
          {/* New estimate card */}
          <div className="bg-brand-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">New Estimate</h3>
            <p className="text-brand-100 text-sm mb-4 leading-relaxed">
              Enter a property address and let AI analyze the roof in seconds.
            </p>
            <Link
              href="/estimates/new"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start Analysis
            </Link>
          </div>

          {/* Plan info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Your Plan</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">Current plan</span>
              <span className="text-sm font-semibold text-slate-900">
                {session.plan}
              </span>
            </div>
            {session.plan === "FREE" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">
                    Estimates remaining
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {session.estimatesLeft} / 3
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                  <div
                    className="bg-brand-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(session.estimatesLeft / 3) * 100}%`,
                    }}
                  />
                </div>
                <Link
                  href="/settings"
                  className="block text-center text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 rounded-xl py-2 hover:bg-brand-50 transition-colors"
                >
                  Upgrade Plan
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
