import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Citizenship by Investment',
  description: 'Qualifying Sugar Ridge purchases provide access to Antigua & Barbuda\'s Citizenship by Investment Programme and visa-free access to 150+ countries.',
}

const benefits = [
  'Visa-free or visa-on-arrival access to 150+ countries',
  'Full citizenship for the investor and eligible family members',
  'No residency requirements once citizenship is granted',
  'No income, capital gains, or inheritance taxes in Antigua',
  'Dual citizenship permitted — retain your current passport',
  'Processing time typically 3–6 months',
  'Passport renewal every 5 years',
  'Access to first-class healthcare and education options',
]

const steps = [
  { step: '01', title: 'Select Your Property', desc: 'Choose a qualifying Sugar Ridge villa, condo, or lot that meets the minimum investment threshold.' },
  { step: '02', title: 'Submit Application', desc: 'Our team guides you through the Citizenship by Investment Unit (CIU) application process.' },
  { step: '03', title: 'Due Diligence', desc: 'The CIU conducts background checks. Processing typically takes 3–6 months.' },
  { step: '04', title: 'Receive Citizenship', desc: 'Upon approval, you and eligible dependants receive Antigua & Barbuda citizenship and passports.' },
]

export default function CitizenshipPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#19130b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Globe size={20} className="text-[#7BC9BF]" />
            <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase">Citizenship by Investment</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Invest. Live. Belong.</h1>
          <p className="text-white/70 max-w-xl leading-relaxed">
            Purchasing a qualifying property at Sugar Ridge opens the door to Antigua &amp;
            Barbuda&apos;s prestigious Citizenship by Investment Programme.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl text-[#19130b] mb-4">Programme Benefits</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Antigua &amp; Barbuda&apos;s CIP offers one of the most attractive citizenship
              programmes in the Caribbean, providing global mobility and financial advantages
              for investors and their families.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle size={18} className="text-[#7BC9BF] mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-[#19130b] mb-6">How It Works</h2>
            <div className="space-y-6">
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#3d0000] text-white flex items-center justify-center font-serif font-bold shrink-0">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#19130b] mb-1">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-[#3d0000] text-white rounded-xl">
              <h3 className="font-serif text-xl mb-2">Ready to Learn More?</h3>
              <p className="text-white/70 text-sm mb-4">
                Our team can provide full details on qualifying investment thresholds and
                connect you with approved citizenship agents.
              </p>
              <Link
                href="/contact?type=citizenship"
                className="inline-flex items-center gap-2 bg-[#7BC9BF] text-[#19130b] px-5 py-2.5 rounded font-semibold hover:bg-[#5aada3] transition-colors text-sm"
              >
                Contact Us <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
