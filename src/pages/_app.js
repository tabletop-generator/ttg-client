import Layout from "../components/Layout";
import { signIn, getUser } from "../auth";
import "@/styles/tailwind.css";

import { Amplify } from "aws-amplify";
import { amplifyConfig } from "../../amplify.config";

Amplify.configure(amplifyConfig);

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
