# ttg-client

[![CI](https://github.com/tabletop-generator/client/actions/workflows/ci.yml/badge.svg)](https://github.com/tabletop-generator/client/actions/workflows/ci.yml)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)
- [Node.js v20.x 'Iron' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Setup

You will need to provide the following environment variables:

- `NEXT_PUBLIC_AWS_COGNITO_POOL_ID`: Your Amazon Cognito User Pool ID
- `NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID`: Your Amazon Cognito App Client ID
- `NEXT_PUBLIC_COGNITO_DOMAIN`: Your Amazon Cognito Managed Login domain
- `NEXT_PUBLIC_OAUTH_SIGN_IN_REDIRECT_URL`: Your app's sign in redirect URL as configured in Amazon Cognito
- `NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL`: Your app's sign out redirect URL as configured in Amazon Cognito
- `NEXT_PUBLIC_AWS_REGION`: Your Amazon Cognito User Pool's region
- `NEXT_PUBLIC_API_URL`: Your [ttg-server](https://github.com/tabletop-generator/ttg-server/) deployment URL

1. Clone the project to your workspace.

   ```bash
   git clone <url> ttg-client
   cd ttg-client
   ```

2. Create a .env file with development presets. Then enter your own environment variables from the links above.

   ```bash
   cp .env.example .env
   ```

3. Install and use the project's supported Node.js version.

   With nvm:

   ```bash
   nvm install
   ```

   With fnm:

   ```bash
   fnm install
   ```

4. Install dependencies.

   ```bash
   npm install
   ```

5. Build the website.

   ```bash
   npm run build
   ```

6. Serve the website on `localhost:3000`.

   ```bash
   npm run serve
   ```

## Solution Stack

- **Language:** [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Framework:** [Next.js](https://nextjs.org/docs)
- **Styling:** [TailwindCSS](https://tailwindcss.com/docs/)
- **Authentication:** [react-oidc-context](https://github.com/authts/react-oidc-context?tab=readme-ov-file#documentation)
- **Runtime:** [Node.js](https://nodejs.org/docs/latest-v20.x/api/)
- **Package Manager:** [npm](https://docs.npmjs.com/)
- **Version Control System:**
  - [Git](https://git-scm.com/doc)
  - [GitHub](https://docs.github.com/)
- **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions)
- **Linting:** [ESLint](https://eslint.org/docs/v8.x/)
- **Formatting:** [Prettier](https://prettier.io/docs/en/)
- **Git Hooks:**
  - [Husky](https://typicode.github.io/husky/)
  - [lint-staged](https://github.com/lint-staged/lint-staged)
