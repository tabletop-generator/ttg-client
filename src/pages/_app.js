// src/pages/_app.js
import Layout from "../components/Layout"; // navbar wrapper
import "@/styles/tailwind.css";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
