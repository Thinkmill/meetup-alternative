import React from 'react';
import App from 'next/app';
import { withApollo } from '../lib/withApollo';
import gql from 'graphql-tag';

import Head from 'next/head';
import { ToastProvider } from 'react-toast-notifications';
import { AuthProvider } from '../lib/authetication';
import StylesBase from '../primitives/StylesBase';
import GoogleAnalytics from '../components/GoogleAnalytics';

class Layout extends React.Component {
  render() {
    const { children, user } = this.props;
    return (
      <ToastProvider>
        <AuthProvider initialUserValue={user}>
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
            />
          </Head>
          <StylesBase />
          {children}
        </AuthProvider>
        <GoogleAnalytics />
      </ToastProvider>
    );
  }
}

Layout.getInitialProps = async ({ apolloClient }) => {
  const data = await apolloClient.query({
    query: gql`
      query {
        authenticatedUser {
          id
          name
          isAdmin
        }
      }
    `,
    fetchPolicy: 'network-only',
  });

  return {
    user: data.data ? data.data.authenticatedUser : undefined,
  };
};

const WrappedLayout = withApollo(Layout);

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <WrappedLayout>
        <Component {...pageProps} />
      </WrappedLayout>
    );
  }
}
