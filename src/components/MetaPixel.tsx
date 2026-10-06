import Script from "next/script";

const PIXEL_IDS = ["805772058874009", "773772088830349", "644226055110020"];

export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;
          n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n;
          n.loaded=!0;
          n.version='2.0';
          n.queue=[];
          t=b.createElement(e);
          t.async=!0;
          t.src=v;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)
          }(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          ${PIXEL_IDS.map((pixelId) => `fbq('init', '${pixelId}');`).join("\n")}

          fbq('track', 'PageView');
        `}
      </Script>

      <noscript>
        {PIXEL_IDS.map((pixelId) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={pixelId}
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        ))}
      </noscript>
    </>
  );
}
