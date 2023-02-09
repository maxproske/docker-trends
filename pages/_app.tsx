import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import PlausibleProvider from 'next-plausible';
import { QueryClientProvider, QueryClient } from 'react-query';
import Script from 'next/script';
import AppHead from 'components/_templates/AppHead';
import Head from 'next/head'
import { pageview } from '../utils/gtag';

import 'normalize.css/normalize.css';
import 'reset-css/reset.css';
import '@reach/combobox/styles.css';
import '../styles/index.scss';

const propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageProps: PropTypes.object,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  // Google Analytics
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const pageTitle = 'Docker Trends: Compare Docker image downloads';
  const pageDescription =
    'Which Docker image should you use? Compare Docker image pull stats over time. Spot trends, pick the winner!';

  return (
    <PlausibleProvider
      domain="dockertrends.com"
      scriptProps={{
        async: true,
        defer: true,
        src: `dockertrends.com`,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AppHead title={pageTitle} description={pageDescription} />

        <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-16V3PKPM5L', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-16V3PKPM5L`}
      />
        {/* <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${FB_PIXEL_ID});
          `,
          }}
        /> */}
        <Component {...pageProps} />
      </QueryClientProvider>
    </PlausibleProvider>
  );
};

MyApp.propTypes = propTypes;

export default MyApp;
