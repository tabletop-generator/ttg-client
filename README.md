# ttg-client

## Development

### Prerequisites

- [Node.js v20.x 'Iron' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)

### Setup

- Clone the project to your workspace

  ```
  git clone
  ```

- Install required packages using npm

  ```
  npm i
  ```

- Enable these VSCode extensions in the project workspace:

  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

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

### Scripts

These scripts are located in `package.json` and can be run using `npm run <script>`.

#### Next.js

- `dev`: Runs `next dev` to start Next.js in development mode.
- `build`: Runs `next build` to build the application for production usage.
- `start`: Runs `next start` to start a Next.js production server.
- `lint:` Runs `next lint` to set up Next.js' built-in ESLint configuration.

#### Serve

- `start:static`: Runs `serve out` to serve static files.

#### Prettier

- `prettier`: Runs `prettier --write .` to format all files in the project directory.
