import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Zap, User, Mail, Shield } from "lucide-react";

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "3 estimates per month",
      "Basic roof analysis",
      "Estimate range",
      "Save to dashboard",
    ],
    cta: "Current Plan",
    highlight: false,
    stripeLink: null,
  },
  {
    id: "STARTER",
    name: "Starter",
    price: "$49",
    period: "/ month",
    features: [
      "50 estimates per month",
      "Advanced AI analysis",
      "Detailed cost breakdown",
      "PDF export",
      "Email delivery",
      "Priority support",
    ],
    cta: "Upgrade to Starter",
    highlight: true,
    stripeLink: "#",
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$149",
    period: "/ month",
    features: [
      "Unlimited estimates",
      "Team seats (up to 10)",
      "White-label reports",
      "API access",
      "CRM integrations",
      "Dedicated account manager",
    ],
    cta: "Upgrade to Pro",
    highlight: false,
    stripeLink: "#",
  },
];

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your account and subscription
        </p>
      </div>

      <div className="space-y-6">
        {/* Account info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">Full Name</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {session.name || "Not set"}
                </p>
              </div>
              <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Edit
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Email Address
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-sm text-slate-500">{session.email}</p>
                </div>
              </div>
              <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Password</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Last changed: Never
                </p>
              </div>
              <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Current plan summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            Current Subscription
          </h2>
          <div className="flex items-center justify-between p-4 bg-brand-50 border border-brand-100 rounded-xl">
            <div>
              <p className="font-semibold text-slate-900">{session.plan} Plan</p>
              {session.plan === "FREE" && (
                <p className="text-sm text-slate-500 mt-0.5">
                  {session.estimatesLeft} of 3 estimates remaining this month
                </p>
              )}
              {session.plan !== "FREE" && (
                <p className="text-sm text-slate-500 mt-0.5">
                  Renews monthly
                </p>
              )}
            </div>
            {session.plan !== "FREE" && (
              <button className="text-sm text-red-500 hover:text-red-600 font-medium">
                Cancel Plan
              </button>
            )}
          </div>
        </div>

        {/* Plan upgrade */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-600" />
            Upgrade Your Plan
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            More estimates, more features, more wins.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = session.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-5 transition-all ${
                    plan.highlight && !isCurrent
                      ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600/20"
                      : "border-slate-200"
                  } ${isCurrent ? "opacity-70" : ""}`}
                >
                  {plan.highlight && !isCurrent && (
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-2">
                      Recommended
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="font-bold text-slate-900">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-sm text-slate-400">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-1.5 text-xs text-slate-600"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="w-full text-center py-2 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg">
                      Current Plan
                    </div>
                  ) : plan.stripeLink ? (
                    <Link
                      href={plan.stripeLink}
                      className={`block w-full text-center py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                        plan.highlight
                          ? "bg-brand-600 text-white hover:bg-brand-700"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-red-200 rounded-2xl p-6">
          <h2 className="font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Delete Account
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                Permanently delete your account and all estimates. This cannot
                be undone.
              </p>
            </div>
            <button className="text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
