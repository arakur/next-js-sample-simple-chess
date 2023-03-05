import Head from "next/head";
import styles from "@/styles/Home.module.css";
import App from "@/pages/_app";

export default function Home() {
  return (
    <>
      <Head>
        <title>Simple Chess</title>
        <meta name="description" content="Simple Chess Board." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Simple Chess</h1>
        <div>
          <App></App>
        </div>
      </main>
    </>
  );
}
