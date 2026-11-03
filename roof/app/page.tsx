import Link from "next/link";
import {
  MapPin,
  Brain,
  FileText,
  CheckCircle,
  Star,
  Zap,
  Shield,
  TrendingUp,
  ChevronRight,
  Satellite,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">RoofAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-navy relative overflow-hidden">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-600/30 text-brand-100 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            Powered by GPT-4o Vision
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Get Accurate Roofing
            <br />
            <span className="text-brand-500">Estimates in Seconds</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter any address and our AI analyzes the roof from satellite imagery —
            delivering instant, professional estimates with detailed breakdowns.
          </p>

          {/* Email CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-12">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white/15 transition-all"
            />
            <Link
              href="/register"
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center whitespace-nowrap"
            >
              Start Free <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            {[
              { icon: Brain, label: "Powered by AI" },
              { icon: Satellite, label: "Satellite Imagery" },
              { icon: FileText, label: "Instant Results" },
              { icon: Shield, label: "No credit card required" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-brand-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <div className="bg-slate-50 border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-10 text-slate-500 text-sm font-medium">
          <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-600" />12,400+ estimates generated</span>
          <span className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" />4.9/5 average rating</span>
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" />SOC 2 compliant</span>
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-600" />Used by 800+ contractors</span>
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to win more jobs
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              RoofAI combines satellite imagery with GPT-4o vision to deliver the most
              accurate roofing estimates on the market.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                color: "bg-blue-50 text-brand-600",
                title: "Enter Any Address",
                desc: "Simply type in a property address. Our system instantly pulls high-resolution satellite imagery — no site visit required.",
              },
              {
                icon: Brain,
                color: "bg-purple-50 text-purple-600",
                title: "AI Roof Analysis",
                desc: "GPT-4o Vision analyzes the satellite image to detect roof type, pitch, complexity, area, and story count with impressive accuracy.",
              },
              {
                icon: FileText,
                color: "bg-green-50 text-green-600",
                title: "Instant Estimate",
                desc: "Receive a detailed estimate range with cost breakdown — materials, labor, and overhead — all in under 30 seconds.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              From address to estimate in 3 steps
            </h2>
            <p className="text-lg text-slate-500">
              No drones, no ladders, no site visits. Just results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-brand-200 to-brand-400" />

            {[
              {
                step: "01",
                title: "Enter the Address",
                desc: "Type any residential or commercial address. Our geocoder pinpoints the exact location and pulls satellite imagery automatically.",
              },
              {
                step: "02",
                title: "AI Analyzes the Roof",
                desc: "GPT-4o Vision inspects the high-res satellite image, identifying roof dimensions, type, pitch, and complexity within seconds.",
              },
              {
                step: "03",
                title: "Receive Your Estimate",
                desc: "Get a detailed estimate range with line-item breakdown. Save it, share it, or export it as a PDF for your client.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-lg shadow-brand-600/30">
                  {step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-500">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Free</h3>
                <div className="text-4xl font-black text-slate-900 mb-1">$0</div>
                <div className="text-sm text-slate-500">Forever free</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {[
                  "3 estimates per month",
                  "Basic roof analysis",
                  "Estimate range",
                  "Save to dashboard",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 px-4 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Starter — highlighted */}
            <div className="bg-brand-600 rounded-2xl p-8 relative shadow-2xl shadow-brand-600/30 ring-4 ring-brand-600/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Starter</h3>
                <div className="text-4xl font-black text-white mb-1">$49</div>
                <div className="text-sm text-brand-200">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-brand-100">
                {[
                  "50 estimates per month",
                  "Advanced AI analysis",
                  "Detailed cost breakdown",
                  "PDF export",
                  "Email delivery",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-200 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 px-4 bg-white rounded-xl text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
              >
                Start Starter Plan
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-navy rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Pro</h3>
                <div className="text-4xl font-black text-white mb-1">$149</div>
                <div className="text-sm text-slate-400">per month</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                {[
                  "Unlimited estimates",
                  "Team seats (up to 10)",
                  "White-label reports",
                  "API access",
                  "CRM integrations",
                  "Dedicated account manager",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 px-4 border border-slate-600 rounded-xl text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Start Pro Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by roofing professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mike Callahan",
                role: "Owner, Callahan Roofing LLC",
                location: "Phoenix, AZ",
                body: "RoofAI cut our estimating time from 45 minutes per job to under 2 minutes. We&apos;re closing 3x more leads because we respond so fast now.",
                stars: 5,
              },
              {
                name: "Sarah Templeton",
                role: "Senior Estimator, SkyLine Roofing",
                location: "Dallas, TX",
                body: "The AI accuracy is remarkable. We compared 50 RoofAI estimates against our manual measurements — within 8% average deviation. It&apos;s become our first step on every job.",
                stars: 5,
              },
              {
                name: "David Park",
                role: "Independent Contractor",
                location: "Atlanta, GA",
                body: "As a solo operator, I don&apos;t have time for long site surveys before I even know if I have a shot at the job. RoofAI lets me quote fast and follow up with a full estimate only once I&apos;m serious.",
                stars: 5,
              },
            ].map(({ name, role, location, body, stars }) => (
              <div
                key={name}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">&ldquo;{body}&rdquo;</p>
                <div>
                  <div className="font-bold text-slate-900">{name}</div>
                  <div className="text-sm text-slate-500">{role}</div>
                  <div className="text-xs text-slate-400 mt-1">{location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start generating AI-powered estimates today
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join hundreds of roofing professionals saving hours every week.
            No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg shadow-brand-600/30"
          >
            Get Started Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white">RoofAI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} RoofAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
