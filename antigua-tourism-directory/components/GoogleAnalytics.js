'use client'

import Script from 'next/script'

export default function GoogleAnalytics({ measurementId }) {
  return (
    <>
      {/* GA4 Consent Mode v2 — defaults to denied until user accepts */}
      <Script
        id="google-analytics-consent-defaults"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // Set consent defaults BEFORE GA4 loads
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });

            // Check if user has already consented and update accordingly
            (function() {
              try {
                var consent = localStorage.getItem('cookie_consent');
                if (consent === 'accepted') {
                  gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                  });
                }
              } catch(e) {}
            })();
          `,
        }}
      />
    </>
  )
}