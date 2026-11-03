import { getServiceSupabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PrintButton from './PrintButton'

interface Props {
  searchParams: Promise<{ id?: string; agentName?: string; agentEmail?: string }>
}

export default async function FlyerPrintPage({ searchParams }: Props) {
  const { id, agentName, agentEmail } = await searchParams
  if (!id) notFound()

  const supabase = getServiceSupabase()
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) notFound()

  const agent = {
    name: agentName || 'Michel Glass',
    email: agentEmail || 'michelglass@remax-365-antigua.com',
  }

  const heroImage = property.images?.[0] || null
  const thumbImages = property.images?.slice(1, 5) || []
  const description = property.short_description || property.description?.substring(0, 250) || ''

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{property.title} — RE/MAX 365 Antigua</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; }

          .flyer {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            display: flex;
            flex-direction: column;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 40px rgba(0,0,0,0.12);
          }

          .header {
            background: #0c2749;
            padding: 20px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .header img { height: 48px; }

          .header-badge {
            background: #f59e0b;
            color: #0c2749;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 5px 14px;
            border-radius: 20px;
          }

          .hero {
            width: 100%;
            height: 240px;
            object-fit: cover;
            display: block;
          }

          .hero-placeholder {
            width: 100%;
            height: 240px;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 14px;
          }

          .content {
            padding: 24px 32px;
            flex: 1;
          }

          .title-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 16px;
          }

          .property-title {
            font-size: 24px;
            font-weight: 800;
            color: #0c2749;
            line-height: 1.2;
          }

          .property-location {
            font-size: 13px;
            color: #64748b;
            margin-top: 4px;
          }

          .price-badge {
            background: #0c2749;
            color: white;
            padding: 10px 16px;
            border-radius: 12px;
            text-align: center;
            flex-shrink: 0;
          }

          .price-amount {
            font-size: 20px;
            font-weight: 800;
            white-space: nowrap;
          }

          .price-currency {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 2px;
          }

          .specs {
            display: flex;
            gap: 20px;
            padding: 12px 0;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 16px;
          }

          .spec {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .spec-icon {
            width: 30px;
            height: 30px;
            background: #f1f5f9;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
          }

          .spec-value {
            font-size: 14px;
            font-weight: 700;
            color: #0c2749;
          }

          .spec-label {
            font-size: 10px;
            color: #94a3b8;
          }

          .description {
            font-size: 13px;
            color: #475569;
            line-height: 1.7;
            margin-bottom: 16px;
          }

          .thumbnail-strip {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
          }

          .thumbnail {
            width: 100%;
            height: 140px;
            object-fit: cover;
            border-radius: 10px;
            display: block;
          }

          .footer {
            background: #0c2749;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
          }

          .agent-name {
            color: white;
            font-size: 14px;
            font-weight: 700;
          }

          .agent-contact {
            color: rgba(255,255,255,0.6);
            font-size: 12px;
            margin-top: 2px;
          }

          .footer-website {
            color: #f59e0b;
            font-size: 13px;
            font-weight: 600;
            text-align: right;
          }

          .footer-phone {
            color: rgba(255,255,255,0.6);
            font-size: 12px;
            margin-top: 2px;
            text-align: right;
          }

          @media print {
            body { background: white; }
            .flyer { margin: 0; border-radius: 0; box-shadow: none; width: 100%; min-height: 100vh; }
          }
        `}</style>
      </head>
      <body>
        <div className="flyer">
          {/* Header */}
          <div className="header">
            <img src="/logo-white.png" alt="RE/MAX 365 Antigua" />
            <span className="header-badge">For Sale</span>
          </div>

          {/* Hero image */}
          {heroImage ? (
            <img src={heroImage} alt={property.title} className="hero" />
          ) : (
            <div className="hero-placeholder">No image available</div>
          )}

          {/* Content */}
          <div className="content">
            <div className="title-row">
              <div>
                <h1 className="property-title">{property.title}</h1>
                <p className="property-location">📍 {property.location}</p>
              </div>
              <div className="price-badge">
                <div className="price-amount">${property.price.toLocaleString()}</div>
                <div className="price-currency">{property.currency}</div>
              </div>
            </div>

            {/* Specs */}
            <div className="specs">
              {property.bedrooms && (
                <div className="spec">
                  <div className="spec-icon">🛏</div>
                  <div>
                    <div className="spec-value">{property.bedrooms}</div>
                    <div className="spec-label">Bedrooms</div>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="spec">
                  <div className="spec-icon">🚿</div>
                  <div>
                    <div className="spec-value">{property.bathrooms}</div>
                    <div className="spec-label">Bathrooms</div>
                  </div>
                </div>
              )}
              {property.sqft && (
                <div className="spec">
                  <div className="spec-icon">📐</div>
                  <div>
                    <div className="spec-value">{property.sqft.toLocaleString()}</div>
                    <div className="spec-label">Interior Sq Ft</div>
                  </div>
                </div>
              )}
              {property.lot_sqft && (
                <div className="spec">
                  <div className="spec-icon">🌿</div>
                  <div>
                    <div className="spec-value">{property.lot_sqft.toLocaleString()}</div>
                    <div className="spec-label">Lot Sq Ft</div>
                  </div>
                </div>
              )}
              <div className="spec">
                <div className="spec-icon">🏠</div>
                <div>
                  <div className="spec-value">{property.property_type}</div>
                  <div className="spec-label">Type</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="description">{description}</p>

            {/* 2x2 thumbnail grid */}
            {thumbImages.length > 0 && (
              <div className="thumbnail-strip">
                {thumbImages.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${property.title} — photo ${i + 2}`}
                    className="thumbnail"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="footer">
            <div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-contact">{agent.email}</div>
            </div>
            <div>
              <div className="footer-website">www.remax-365-antigua.com</div>
              <div className="footer-phone">+1 268-724-9308</div>
            </div>
          </div>
        </div>

        <PrintButton />
      </body>
    </html>
  )
}