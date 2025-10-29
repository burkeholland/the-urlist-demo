# Copilot Instructions

## Project Snapshot
- Next.js 16 App Router with React 19; primary entrypoints are `app/layout.tsx` and `app/page.tsx`.
- Path imports rely on the `@/*` alias from `tsconfig.json`; keep new source files under existing top-level folders to preserve that mapping.

## Styling System
- Tailwind CSS v4 runs through `@tailwindcss/postcss`; design tokens and light/dark palettes live in `app/globals.css` using `@theme inline` and CSS variables.
- Always compose classes with the `cn` helper from `lib/utils.ts` for consistent `tailwind-merge` behavior.
- Prefer semantic token utilities (`bg-background`, `text-foreground`, etc.) over raw color literals; extend tokens inside `@theme inline` if a new value is required.
- The `@custom-variant dark` macro controls dark selectors; align any custom rules with that convention instead of hard-coding `.dark`.

## UI Components
- Shared primitives live in `components/ui`; extend them (e.g., add variants in `components/ui/button.tsx`) rather than cloning tailwind strings.
- Variant logic uses `class-variance-authority`; update both the `buttonVariants` definition and `VariantProps` typing when introducing new options.
- Client islands follow the shadcn pattern: begin files with `"use client"` and allow polymorphism through `@radix-ui/react-slot`'s `asChild` prop.
- Icons come from `lucide-react`; button styles already constrain embedded SVGs to `size-4`, so additional icons should honor that sizing.

## Pages & Layout
- `app/layout.tsx` wires Geist fonts and base typography; augment layout styling via the existing `cn` call instead of inline string concatenation.
- Pages default to Server Components; explicitly add `"use client"` when introducing hooks or browser-only APIs, and isolate interactivity to small client wrappers.
- Marketing copy in `app/page.tsx` is static; move future data access to async server components or dedicated client islands to keep the root lightweight.

## Tooling & Workflows
- Development: `npm run dev`; production build: `npm run build` followed by `npm run start`; lint with `npm run lint`.
- TypeScript is strict with `moduleResolution: "bundler"`; ensure new imports resolve via ESM-friendly paths and avoid untyped fallbacks.
- `components.json` configures shadcn scaffolding; keep aliases in sync if you add new folders or run the generator.

## Conventions
- Organize routes under `app/*`, shared utilities in `lib`, and ambient typings in `types` (e.g., `types/css.d.ts` for CSS modules).
- Maintain the accessibility practices demonstrated on the hero form (labels, focus styles, `title` tooltips) when adding interactive elements.
- Avoid editing framework boilerplate (`next.config.ts`, `postcss.config.mjs`) unless deliberately changing build behavior; most customizations belong in page/components code.