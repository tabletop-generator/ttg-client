# ttg-client

## Development

### Prerequisites

- [Node.js v20.x 'Iron' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Setup

- `git clone <url>`: Clone the project to your workspace

- `npm i`: Install required packages using npm

- Enable these VSCode extensions in the project workspace:

  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Scripts

These scripts are located in `package.json` and can be run using `npm run <script>`.

- `dev`: Runs `next dev` to start Next.js in development mode.
- `build`: Runs `next build` to build the application for production usage.
- `start`: Runs `next start` to start a Next.js production server.
- `start:static`: Runs `serve out` to serve the built static files from `out/`.
- `lint:` Runs `next lint` to run Next.js' built-in ESLint configuration.
- `prettier`: Runs `prettier --write .` to format all files in the project directory.
- `prepare`: Not intended for manual use. Used to run the pre-commit hook which formats and lints code before every commit.

### Documentation

- [TypeScript](https://www.typescriptlang.org/docs/)
- [Next.js](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs/)
- [Node.js](https://nodejs.org/docs/latest-v20.x/api/)
- [npm](https://docs.npmjs.com/)
- [Git](https://git-scm.com/doc)
- [GitHub](https://docs.github.com/)
  - [GitHub Actions](https://docs.github.com/en/actions)
- [ESLint](https://eslint.org/docs/v8.x/)
- [Prettier](https://prettier.io/docs/en/)
- [Husky](https://typicode.github.io/husky/)
