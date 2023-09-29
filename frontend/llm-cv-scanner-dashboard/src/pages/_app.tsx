import * as React from 'react';
import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
 
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
     <CssBaseline />
     <Component {...pageProps} />
    </>
  )
  

}