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
  },
};

console.log("Server-Side ENV Variables:", {
  poolId: process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID,
  clientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirectUrl: process.env.NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL,
});

console.log("PASSING THROUGH NEXT CONFIG MJS FILE");

export default nextConfig;
