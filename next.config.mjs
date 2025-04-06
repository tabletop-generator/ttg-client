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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Add the image optimization settings
  images: {
    domains: [
      "localhost", // For development environment
      "assets.tabletop-generator.com", // Replace with your actual image domain
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any hostname for now, restrict this in production
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development", // For static export in dev
  },
};

export default nextConfig;
