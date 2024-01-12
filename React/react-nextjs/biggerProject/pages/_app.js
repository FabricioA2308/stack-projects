import { Fragment } from "react";
import Layout from "../components/layout/Layout.js";
import "../public/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Fragment>
  );
}
