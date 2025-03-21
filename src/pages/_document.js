// pages/_document.js

import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-black">
      <Head>
        {/* Inter Font */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
