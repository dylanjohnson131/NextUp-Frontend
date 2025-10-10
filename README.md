# NextUp Frontend (minimal scaffold)

This repository contains a minimal Next.js + React scaffold using JavaScript and plain CSS with optional Tailwind CSS support.

The steps below assume you're on Windows using PowerShell. They are copy-paste ready.

1) Prerequisites

- Node.js (v18+ recommended) and npm. Check with:

```powershell
node -v
npm -v
```

If Node is not installed, download and install it from https://nodejs.org/.

2) Clone or open the repository

Open PowerShell and change to the project folder

3) Install project dependencies

Install runtime dependencies and devDependencies defined in `package.json`:

```powershell
npm install
```

This will create `node_modules` and `package-lock.json`.

4) (Optional) Tailwind CSS setup

Tailwind is already added to this project. If you need to re-initialize or re-configure Tailwind, you can run:

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Note: `npx tailwindcss init -p` may fail in some environments; if it does, `tailwind.config.js` and `postcss.config.js` are already provided in the repo — no further action is required.

5) Run the dev server

Start the Next.js development server:

```powershell
npm run dev
```

Open http://localhost:3000 in your browser. The terminal will show a `Local: http://localhost:3000` line when the server is ready.

6) Troubleshooting and tips

- If you see CSS linter warnings like "Unknown at rule @tailwind", that's an editor linting issue (your editor doesn't recognize Tailwind at-rules). It won't affect the running app. Install Tailwind/PostCSS plugins or disable that rule in your editor if desired.
- To see security advisories reported by npm:

```powershell
npm audit
npm audit fix
```

Use `npm audit fix --force` only if you accept the risk of potentially upgrading packages across major versions.
- If `npx tailwindcss init -p` fails, the repo already contains `tailwind.config.js` and `postcss.config.js` that were added earlier.

7) Common commands

```powershell
npm run dev     # start dev server
npm run build   # build for production
npm start       # start production server after build
npm run lint    # run linter (if configured)
```

8) Want me to do more?

- I can add a small Tailwind-styled component and example usage.
- I can run `npm audit` and apply fixes.
- I can add an EditorConfig / recommended VS Code settings for Tailwind IntelliSense.

Enjoy building! If you want, I can also create a quick demo component that uses Tailwind classes.
