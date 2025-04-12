// src/pages/_app.js

import cognitoAuthConfig from "@/cognitoAuthConfig";
import Layout from "@/components/Layout.jsx";
import withAuth from "@/components/auth/withAuth";
import { UserProvider } from "@/context/UserContext";
import "@/styles/tailwind.css";
import { AuthProvider } from "react-oidc-context";

export default function App({ Component, pageProps }) {
  const isProtectedPage = pageProps?.protected ?? Component?.protected ?? true;
  const WrappedComponent = isProtectedPage ? withAuth(Component) : Component;

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <UserProvider>
        <Layout>
          <WrappedComponent {...pageProps} />
        </Layout>
      </UserProvider>
    </AuthProvider>
  );
}
