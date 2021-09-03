import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { Provider, useSession } from 'next-auth/client';

import PageChange from 'components/PageChange/PageChange.js';

import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/nextjs-argon-dashboard.scss';
import 'assets/css/style.css';

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  document.body.classList.add('body-page-transition');
  ReactDOM.render(<PageChange path={url} />, document.getElementById('page-transition'));
});
Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});

function Authenticated({ children }) {
  const [session, loading] = useSession();
  const isUser = !!session?.user;
  const router = useRouter();
  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) router.push('/auth/login');
    // If not authenticated, force log in
  }, [isUser, loading]);
  if (isUser) {
    return children;
  }
  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}

export default class MyApp extends App {
  // static async getInitialProps({ Component, router, ctx }) {
  //   let pageProps = {};

  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx);
  //   }

  //   return { pageProps };
  // }

  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <Provider session={pageProps.session}>
        <React.Fragment>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>FinancialVotes | Best new Crypto Coins</title>
          </Head>
          <Layout>
            {Component.protected ? (
              <Authenticated>
                <Component {...pageProps} />
              </Authenticated>
            ) : (
              <Component {...pageProps} />
            )}
          </Layout>
        </React.Fragment>
      </Provider>
    );
  }
}
