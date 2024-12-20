# ttg-client

[![CI](https://github.com/tabletop-generator/client/actions/workflows/ci.yml/badge.svg)](https://github.com/tabletop-generator/client/actions/workflows/ci.yml)

## Prerequisites

- [Node.js v20.x 'Iron' (LTS)](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Setup

- `git clone`: Clone the project to your workspace

- `npm i`: Install required packages using npm

- Enable these VSCode extensions in the project workspace:

  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Scripts

These scripts are located in `package.json` and can be run using `npm run <script>`.

- `dev`: Runs `next dev` to start Next.js in development mode.
- `build`: Runs `next build` to build the application for production usage.
- `start`: Runs `next start` to start a Next.js production server.
- `start:static`: Runs `serve out` to serve the built static files from `out/`.
- `lint:` Runs `next lint` to run Next.js' built-in ESLint configuration.
- `prettier`: Runs `prettier --write .` to format all files in the project directory.
- `prepare`: Not intended for manual use. Used to run the pre-commit hook which formats and lints code before every commit.

## Workflow

Please follow the [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) for contributions:

1. **Update your local main branch**

   Switch to your main branch and pull the latest changes from the remote repository:

   ```bash
   git switch main
   git pull --prune
   ```

   - The `--prune` option removes any references to branches that no longer exist on the remote.

2. **Create a new branch**

   Name your branch following the convention `issue-number` (e.g., `issue-1`):

   ```bash
   git switch -c <issue-number> main
   ```

   - If no issue exists for the change you are making, please [create one](https://github.com/tabletop-generator/client/issues/new/choose).

3. **Make your changes**

   Start the development server:

   ```bash
   npm run dev
   ```

4. **Test your changes**

   Run the following checks to ensure everything works as expected:

   ```bash
   npm run lint
   npm run build
   npm start:static
   ```

5. **Review your changes**

   Check which files have been changed:

   ```bash
   git status
   ```

6. **Stage your changes**

   Add the relevant files to staging:

   ```bash
   git add <files>
   ```

7. **Commit your changes**

   Write a meaningful commit message:

   ```bash
   git commit -m "<commit message>"
   ```

8. **Push your branch**

   Push your changes and set the upstream branch:

   ```bash
   git push -u origin <your-branch-name>
   ```

9. **Create a pull request**

   [Create a pull request](https://github.com/tabletop-generator/client/compare) on GitHub. Fill in the template and link it to the issue using:

   ```txt
   Fixes #[issue number]
   ```

## Documentation

- **Language:** [TypeScript](https://www.typescriptlang.org/docs/)
- **Framework:** [Next.js](https://nextjs.org/docs)
- **Styling:** [TailwindCSS](https://tailwindcss.com/docs/)
- **Runtime:** [Node.js](https://nodejs.org/docs/latest-v20.x/api/)
- **Package Manager:** [npm](https://docs.npmjs.com/)
- **Version Control System:**
  - [Git](https://git-scm.com/doc)
  - [GitHub](https://docs.github.com/)
- **CI/CD:** [GitHub Actions](https://docs.github.com/en/actions)
- **Linting:** [ESLint](https://eslint.org/docs/v8.x/)
- **Formatting:** [Prettier](https://prettier.io/docs/en/)
- **Git Hooks:** [Husky](https://typicode.github.io/husky/)
