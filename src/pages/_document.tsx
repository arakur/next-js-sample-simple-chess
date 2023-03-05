import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          media="screen"
          href="https://fontlibrary.org//face/pecita"
          type="text/css"
        />
        <link
          rel="stylesheet"
          media="screen"
          href="https://fontlibrary.org//face/dejavu-sans"
          type="text/css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
