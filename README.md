# Serendipity Arts Festival 2026

The Next.js frontend for Serendipity Arts Festival. It uses the App Router, TypeScript, Tailwind CSS, Redux Toolkit, and the SAF backend API.

## Development

```bash
yarn
yarn dev
```

Create a local environment file with the public backend URL when required:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Quality checks

```bash
yarn format          # Format the project
yarn lint            # Run ESLint
yarn typecheck       # Run TypeScript without emitting files
yarn run check       # Run formatting, linting, and type checks
yarn build           # Build the production application
```

Husky runs `yarn lint-staged` before each commit. Staged TypeScript and JavaScript files are linted and formatted; styles, JSON, Markdown, and YAML are formatted.

## Source layout

```text
src/
├── app/          # Routes, layouts, and route-local client components
├── components/   # UI organised by domain (auth, layout, maps, common, …)
├── config/       # Site-wide configuration
├── context/      # React context providers
├── data/         # Static editorial data
├── hooks/        # Reusable hooks
├── lib/          # Framework/API integrations and helpers
├── redux/        # Store, slices, typed hooks, and providers
├── services/     # Backend endpoint modules
├── types/        # Shared TypeScript contracts
├── utils/        # Small pure utilities
└── validations/  # Form validation schemas
```

Use `@/…` for source imports and `@public/…` only for static asset imports from `public/`.
