import { Layout } from "../components/Layout";
import Head from "next/head";
import "./index.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Realms Of Ether</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MyApp;
