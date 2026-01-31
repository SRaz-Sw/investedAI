'use client';

import Script from 'next/script';

// For static exports, env vars must be embedded at build time.
// The value is inlined via next.config.js `env`.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || '';

export function Clarity() {
  // Log for debugging in both dev and production
  if (typeof window !== 'undefined' && !CLARITY_ID) {
    console.error('Microsoft Clarity: NEXT_PUBLIC_CLARITY_ID is not set. Clarity will not load.');
  }

  if (!CLARITY_ID) {
    return null;
  }

  // Log successful initialization (this will be removed in production by next.config)
  if (typeof window !== 'undefined') {
    console.log('Microsoft Clarity: Initializing with ID:', CLARITY_ID);
  }

  return (
    <Script
      id="clarity-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `,
      }}
    />
  );
}
