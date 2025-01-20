const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-2.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_COGNITO_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL,
  response_type: "code",
  scope: "email openid",
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export default cognitoAuthConfig;
