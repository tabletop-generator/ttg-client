// next.config.mjs

// This is basically environment variable forwarding, doesn't need to be kept secret

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_AWS_COGNITO_POOL_ID:
      process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID,
    NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID:
      process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL:
      process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL,
    NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL:
      process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL,
    NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  },
};

export default nextConfig;
