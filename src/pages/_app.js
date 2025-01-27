// src/pages/_app.js
import cognitoAuthConfig from "@/cognitoAuthConfig";
import Layout from "@/components/Layout.jsx"; // navbar wrapper
import "@/styles/tailwind.css";
import { AuthProvider } from "react-oidc-context";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
