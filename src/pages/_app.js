// src/pages/_app.js

import { AuthProvider } from "../AuthContext"; // lets all components access authorization context
import Layout from "../components/Layout"; // navbar wrapper
import "@/styles/tailwind.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
