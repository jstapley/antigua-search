import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, FileText, Settings, LogOut, Zap, Plus } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const planColors = {
    FREE: "bg-slate-100 text-slate-600",
    STARTER: "bg-blue-100 text-blue-700",
    PRO: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">RoofAI</span>
          </Link>
        </div>

        {/* New Estimate CTA */}
        <div className="px-4 py-4 border-b border-slate-100">
          <Link
            href="/estimates/new"
            className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Estimate
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/estimates"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Estimates
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
              {(session.name || session.email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-slate-900 text-sm truncate">
                {session.name || session.email}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    planColors[session.plan]
                  }`}
                >
                  {session.plan}
                </span>
                {session.plan === "FREE" && (
                  <span className="text-xs text-slate-400">
                    {session.estimatesLeft} left
                  </span>
                )}
              </div>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content offset for fixed sidebar */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
