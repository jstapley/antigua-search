'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer, Trash2 } from 'lucide-react'

interface Submission {
  id: string
  form_type: string
  form_title: string
  form_data: Record<string, unknown>
  created_by: string | null
  created_at: string
}

function formatDate(d: string) {
  if (!d) return ''
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return d
  return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function Field({ label, value }: { label: string; value?: unknown }) {
  if (!value && value !== false) return null
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-gray-900 border-b border-gray-200 pb-1">{String(value)}</p>
    </div>
  )
}

function CheckField({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center ${checked ? 'border-[#0c2749] bg-[#0c2749]' : 'border-gray-300'}`}>
        {checked && <span className="text-white text-[10px] font-bold">✓</span>}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-4 pb-2 border-b-2 border-[#0c2749]">
      <h3 className="font-bold text-[#0c2749] text-sm uppercase tracking-wide">{children}</h3>
    </div>
  )
}

function ClientInformationView({ d }: { d: Record<string, unknown> }) {
  return (
    <>
      <SectionHeader>Section A — Property & Transaction Details</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Property Name" value={d.property_name} />
        <Field label="Listing Amount" value={d.listing_amount} />
      </div>
      <Field label="Reason for Selling / Purchasing" value={d.reason} />

      <SectionHeader>Section B — Client Personal Information</SectionHeader>
      <Field label="Full Name" value={d.full_name} />
      <Field label="Other Names or Aliases" value={d.aliases} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Place of Birth" value={d.place_of_birth} />
        <Field label="Nationality" value={d.nationality} />
      </div>
      <Field label="Marital Status" value={d.marital_status ? String(d.marital_status).replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) : undefined} />
      <Field label="PEP (Politically Exposed Person)" value={d.pep ? String(d.pep).toUpperCase() : undefined} />
      {d.pep === 'yes' && <Field label="PEP Affiliation" value={d.pep_affiliation} />}
      <Field label="Physical Address" value={d.physical_address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone Number" value={d.telephone} />
        <Field label="Email Address" value={d.email} />
        <Field label="Occupation / Principal Business Activity" value={d.occupation} />
        <Field label="Employer Name / Business Name" value={d.employer} />
      </div>

      <SectionHeader>Section C — Identification Details</SectionHeader>
      <Field label="Identification Document" value={d.id_type === 'other' ? `Other: ${d.id_other}` : 'Passport'} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Country of Issue" value={d.country_of_issue} />
        <Field label="Document Number" value={d.document_number} />
        <Field label="Signature" value={d.signature_name} />
        <Field label="Authorised Representative" value={d.authorized_rep_name} />
        <Field label="Date" value={d.signature_date ? formatDate(d.signature_date as string) : undefined} />
      </div>

      <SectionHeader>Section F — Office Use Only</SectionHeader>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Documents Provided</p>
      <CheckField label="ID" checked={d.office_id as boolean} />
      <CheckField label="Proof of Ownership (POO)" checked={d.office_poo as boolean} />
      <CheckField label="Proof of Address (POA)" checked={d.office_poa as boolean} />
      <CheckField label="Source of Funds (SOF)" checked={d.office_sof as boolean} />
      <CheckField label="Passport/ID Attached" checked={d.passport_attached as boolean} />
      <div className="mt-3">
        <CheckField label="Transaction Accepted" checked={d.transaction_accepted as boolean} />
        <CheckField label="Transaction Declined" checked={d.transaction_declined as boolean} />
      </div>
      <div className="grid grid-cols-2 gap-x-8 mt-4">
        <Field label="Prepared by" value={d.prepared_by} />
        <Field label="Reviewed by" value={d.reviewed_by} />
      </div>

      <SectionHeader>Section G — Notes</SectionHeader>
      <Field label="Date" value={d.notes_date ? formatDate(d.notes_date as string) : undefined} />
      <Field label="Notes" value={d.notes} />
    </>
  )
}

function BuyerRepresentationView({ d }: { d: Record<string, unknown> }) {
  const agent = d.agent as Record<string, string> | undefined
  return (
    <>
      <Field label="Date of Agreement" value={d.agreement_date ? formatDate(d.agreement_date as string) : undefined} />

      <SectionHeader>1 — Parties to the Agreement</SectionHeader>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Buyer</p>
      <Field label="Full Name" value={d.buyer_name} />
      <Field label="Address" value={d.buyer_address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={d.buyer_telephone} />
        <Field label="Email" value={d.buyer_email} />
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-4">Agent / Real Estate Brokerage</p>
      <Field label="Name" value={agent?.name ?? 'Michel Glass Lamdan'} />
      <Field label="Address" value={agent?.address ?? 'Jolly Harbour Commercial Center, Antigua'} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={agent?.telephone ?? '+1-268-724-9308'} />
        <Field label="Email" value={agent?.email ?? 'michelglass@remax-365-antigua.com'} />
      </div>

      <SectionHeader>3 — Term of Agreement</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Start Date" value={d.start_date ? formatDate(d.start_date as string) : undefined} />
        <Field label="Expiry Date" value={d.end_date ? formatDate(d.end_date as string) : undefined} />
      </div>

      <SectionHeader>7 — Commission & Fees</SectionHeader>
      <p className="text-sm text-gray-700">Commission rate: <strong>2%</strong> of the purchase price, due upon successful completion.</p>
      <Field label="Post-termination protection period (months)" value={d.post_termination_months} />

      <SectionHeader>Signatures</SectionHeader>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Buyer 1</p>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Name" value={d.buyer1_name} />
        <Field label="Date" value={d.buyer1_date ? formatDate(d.buyer1_date as string) : undefined} />
      </div>
      {!!d.buyer2_name && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Buyer 2</p>
          <div className="grid grid-cols-2 gap-x-8">
            <Field label="Name" value={d.buyer2_name} />
            <Field label="Date" value={d.buyer2_date ? formatDate(d.buyer2_date as string) : undefined} />
          </div>
        </>
      )}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Agent</p>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Name" value={agent?.name ?? 'Michel Glass Lamdan'} />
        <Field label="Date" value={d.agent_date ? formatDate(d.agent_date as string) : undefined} />
      </div>
    </>
  )
}

function ExclusiveSellerView({ d }: { d: Record<string, unknown> }) {
  const agent = d.agent as Record<string, string> | undefined
  return (
    <>
      <Field label="Date of Agreement" value={d.agreement_date ? formatDate(d.agreement_date as string) : undefined} />

      <SectionHeader>1 — Parties to the Agreement</SectionHeader>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller</p>
      <Field label="Name" value={d.seller_name} />
      <Field label="Address" value={d.seller_address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={d.seller_telephone} />
        <Field label="Email" value={d.seller_email} />
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Agent / Real Estate Brokerage</p>
      <Field label="Name" value={agent?.name} />
      <Field label="Address" value={agent?.address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={agent?.telephone} />
        <Field label="Email" value={agent?.email} />
      </div>

      <SectionHeader>Sale Price</SectionHeader>
      <Field label="Sale Price" value={d.sale_price} />

      <SectionHeader>3 — Property Description</SectionHeader>
      <Field label="Property Address" value={d.property_address} />
      <div className="grid grid-cols-3 gap-x-6">
        <Field label="Registration Parcel" value={d.reg_parcel} />
        <Field label="Block" value={d.block} />
        <Field label="Section" value={d.section} />
      </div>
      <Field label="Other Details" value={d.other_details} />

      <SectionHeader>4 — Term of Agreement</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Start Date" value={d.start_date ? formatDate(d.start_date as string) : undefined} />
        <Field label="Expiry Date" value={d.end_date ? formatDate(d.end_date as string) : undefined} />
      </div>

      <SectionHeader>7 — Commission & Fees</SectionHeader>
      <p className="text-sm text-gray-700"><strong>5% commission + ABST</strong> upon successful sale. Agent entitled to commission for 6 months post-expiry for agent-introduced buyers.</p>

      <SectionHeader>Signatures</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller</p>
          <Field label="Name" value={d.seller_sig_name} />
          <Field label="Date" value={d.seller_sig_date ? formatDate(d.seller_sig_date as string) : undefined} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Agent</p>
          <Field label="Name" value={agent?.name ?? 'Michel Glass Lamdan'} />
          <Field label="Date" value={d.agent_sig_date ? formatDate(d.agent_sig_date as string) : undefined} />
        </div>
      </div>
    </>
  )
}

function LetterOfIntentView({ d }: { d: Record<string, unknown> }) {
  const seller2 = (d.seller2_name as string | undefined)?.trim()
  const buyer2 = (d.buyer2_name as string | undefined)?.trim()
  return (
    <>
      <SectionHeader>Seller</SectionHeader>
      <Field label="Seller 1 Name" value={d.seller_name} />
      {seller2 && <Field label="Seller 2 Name" value={seller2} />}
      <Field label="Address" value={d.seller_address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={d.seller_telephone} />
        <Field label="Email" value={d.seller_email} />
      </div>

      <SectionHeader>Buyer</SectionHeader>
      <Field label="Buyer 1 Name" value={d.buyer_name} />
      {buyer2 && <Field label="Buyer 2 Name" value={buyer2} />}
      <Field label="Address" value={d.buyer_address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={d.buyer_telephone} />
        <Field label="Email" value={d.buyer_email} />
      </div>

      <SectionHeader>The Property</SectionHeader>
      <p className="text-xs text-gray-500 mb-3">Registered in the Register of Lands of Antigua and Barbuda.</p>
      <div className="grid grid-cols-3 gap-x-6">
        <Field label="Registration Parcels" value={d.reg_parcel} />
        <Field label="Block" value={d.block} />
        <Field label="Section" value={d.section} />
      </div>

      <SectionHeader>Financial Terms</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Purchase Price (USD)" value={d.purchase_price ? `US$ ${Number(d.purchase_price).toLocaleString()}` : undefined} />
        <Field label="10% Deposit" value={d.deposit_10pct ? `US$ ${d.deposit_10pct}` : undefined} />
        <Field label="Balance" value={d.balance_90pct ? `US$ ${d.balance_90pct}` : undefined} />
        <Field label="Closing Date" value={d.closing_date ? formatDate(d.closing_date as string) : undefined} />
      </div>
      <Field label="Conditions of Offer" value={d.conditions} />

      <SectionHeader>Commission</SectionHeader>
      <p className="text-sm text-gray-700">By accepting this offer, the Seller agrees to pay <strong>5% commission + 17% ABST</strong> to SAMSARA Ltd., trading as RE/MAX 365.</p>

      <SectionHeader>Signatures</SectionHeader>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller 1</p>
      <div className="grid grid-cols-2 gap-x-8 mb-4">
        <Field label="Name" value={d.seller_name} />
        <Field label="Date" value={d.seller_date ? formatDate(d.seller_date as string) : undefined} />
        <Field label="Witness" value={d.seller_witness} />
      </div>

      {seller2 && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller 2</p>
          <div className="grid grid-cols-2 gap-x-8 mb-4">
            <Field label="Name" value={seller2} />
            <Field label="Date" value={d.seller2_sig_date ? formatDate(d.seller2_sig_date as string) : undefined} />
            <Field label="Witness" value={d.seller2_witness} />
          </div>
        </>
      )}

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Buyer 1</p>
      <div className="grid grid-cols-2 gap-x-8 mb-4">
        <Field label="Name" value={d.buyer_name} />
        <Field label="Date" value={d.purchaser_date ? formatDate(d.purchaser_date as string) : undefined} />
        <Field label="Witness" value={d.purchaser_witness} />
      </div>

      {buyer2 && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Buyer 2</p>
          <div className="grid grid-cols-2 gap-x-8 mb-4">
            <Field label="Name" value={buyer2} />
            <Field label="Date" value={d.buyer2_sig_date ? formatDate(d.buyer2_sig_date as string) : undefined} />
            <Field label="Witness" value={d.buyer2_witness} />
          </div>
        </>
      )}
    </>
  )
}

function NonExclusiveSellerView({ d }: { d: Record<string, unknown> }) {
  const agent = d.agent as Record<string, string> | undefined
  return (
    <>
      <Field label="Date of Agreement" value={d.agreement_date ? formatDate(d.agreement_date as string) : undefined} />

      <SectionHeader>1 — Parties to the Agreement</SectionHeader>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller(s)</p>
      <Field label="Seller 1 Name" value={d.seller1_name} />
      {!!d.seller2_name && <Field label="Seller 2 Name" value={d.seller2_name as string} />}
      <Field label="Address" value={d.seller_address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={d.seller_telephone} />
        <Field label="Email" value={d.seller_email} />
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Agent / Real Estate Brokerage</p>
      <Field label="Name" value={agent?.name} />
      <Field label="Address" value={agent?.address} />
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Telephone" value={agent?.telephone} />
        <Field label="Email" value={agent?.email} />
      </div>

      <SectionHeader>Sale Price</SectionHeader>
      <Field label="Sale Price (USD)" value={d.sale_price ? `US$ ${Number(d.sale_price).toLocaleString()}` : undefined} />

      <SectionHeader>3 — Property Description</SectionHeader>
      <Field label="Property Address" value={d.property_address} />
      <div className="grid grid-cols-3 gap-x-6">
        <Field label="Registration Parcel" value={d.reg_parcel} />
        <Field label="Block" value={d.block} />
        <Field label="Section" value={d.section} />
      </div>
      <Field label="Other Details" value={d.other_details} />

      <SectionHeader>4 — Term of Agreement</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <Field label="Start Date" value={d.start_date ? formatDate(d.start_date as string) : undefined} />
        <Field label="Expiry Date" value={d.end_date ? formatDate(d.end_date as string) : undefined} />
      </div>

      <SectionHeader>7 — Commission & Fees</SectionHeader>
      <p className="text-sm text-gray-700"><strong>5% commission + ABST</strong> — payable only if buyer was introduced by agent. No commission if sold independently. 12-month post-expiry protection.</p>

      <SectionHeader>Signatures</SectionHeader>
      <div className="grid grid-cols-2 gap-x-8">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller 1</p>
          <Field label="Name" value={d.seller1_sig_name} />
          <Field label="Date" value={d.seller1_sig_date ? formatDate(d.seller1_sig_date as string) : undefined} />
        </div>
        {!!d.seller2_name && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seller 2</p>
            <Field label="Name" value={d.seller2_sig_name} />
            <Field label="Date" value={d.seller2_sig_date ? formatDate(d.seller2_sig_date as string) : undefined} />
          </div>
        )}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Agent</p>
          <Field label="Name" value={agent?.name ?? 'Michel Glass Lamdan'} />
          <Field label="Date" value={d.agent_sig_date ? formatDate(d.agent_sig_date as string) : undefined} />
        </div>
      </div>
    </>
  )
}

const FORM_LABELS: Record<string, string> = {
  'client-information': 'Client Information Form',
  'buyer-representation': 'Buyer Representation Agreement',
  'exclusive-seller': 'Exclusive Seller Representation Agreement',
  'letter-of-intent': 'Letter of Intent — Interest to Purchase',
  'non-exclusive-seller': 'Non-Exclusive Seller Representation Agreement',
}

export default function ViewFormPage() {
  const params = useParams()
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/form-submissions/${params.id}`)
      .then(r => r.json())
      .then(data => { setSubmission(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handlePrint = () => window.print()

  const handleDelete = async () => {
    if (!confirm(`Delete "${submission?.form_title}"?`)) return
    setDeleting(true)
    await fetch(`/api/admin/form-submissions/${params.id}`, { method: 'DELETE' })
    router.push('/admin/forms')
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading form...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p className="text-sm">Form not found.</p>
        <Link href="/admin/forms" className="text-[#0c2749] font-medium hover:underline text-sm mt-2 inline-block">← Back to Forms</Link>
      </div>
    )
  }

  const d = submission.form_data

  const renderBody = () => {
    switch (submission.form_type) {
      case 'client-information': return <ClientInformationView d={d} />
      case 'buyer-representation': return <BuyerRepresentationView d={d} />
      case 'exclusive-seller': return <ExclusiveSellerView d={d} />
      case 'letter-of-intent': return <LetterOfIntentView d={d} />
      case 'non-exclusive-seller': return <NonExclusiveSellerView d={d} />
      default: return <pre className="text-xs text-gray-600">{JSON.stringify(d, null, 2)}</pre>
    }
  }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 20px !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Admin toolbar — hidden on print */}
      <div className="no-print p-8 pb-0">
        <div className="flex items-center justify-between mb-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <Link href="/admin/forms" className="text-gray-400 hover:text-[#0c2749] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-xl font-bold text-[#0c2749]">{submission.form_title}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {FORM_LABELS[submission.form_type] || submission.form_type}
                {' · '}
                {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold text-sm transition-colors border border-red-100 disabled:opacity-40"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Form content — printed */}
      <div className="p-8 pt-4 max-w-3xl">
        <div ref={printRef} className="print-area bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-[#0c2749]">
            <p className="text-lg font-bold text-[#0c2749]">RE/MAX 365 Antigua</p>
            <p className="text-xs text-gray-400">Samsara Limited · Jolly Harbour Commercial Center · +1-268-724-9308</p>
            <p className="text-xs text-gray-400">michelglass@remax-365-antigua.com · remax-365-antigua.com</p>
            <h2 className="mt-4 text-base font-bold text-gray-900 uppercase tracking-wide">
              {FORM_LABELS[submission.form_type] || submission.form_type}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Submitted {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {renderBody()}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              RE/MAX 365 Antigua — Licensed under the applicable laws and regulations of Antigua and Barbuda.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
