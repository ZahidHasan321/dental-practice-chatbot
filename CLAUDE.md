# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16-based dental practice chatbot application built with React 19, TypeScript, and Tailwind CSS v4. The project is currently in its initial state, bootstrapped from create-next-app.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Technology Stack

- **Framework**: Next.js 16.0.3 with App Router
- **React**: Version 19.2.0 (latest)
- **TypeScript**: Version 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS integration
- **Fonts**: Geist Sans and Geist Mono (auto-optimized via next/font)

## Architecture

### App Router Structure

This project uses Next.js App Router (not Pages Router). All routes are defined in the `app/` directory:

- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles with Tailwind imports and CSS custom properties

### Styling Approach

The project uses **Tailwind CSS v4** with the new `@import "tailwindcss"` syntax (not v3's directives). Key points:

- CSS custom properties defined in `globals.css` for theming (`--background`, `--foreground`)
- Inline theme configuration using `@theme inline` directive
- Dark mode support via `prefers-color-scheme` media query
- PostCSS configuration in `postcss.config.mjs` with `@tailwindcss/postcss` plugin

### TypeScript Configuration

- Path alias: `@/*` maps to root directory
- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX mode: react-jsx (React 19's automatic runtime)

### ESLint Configuration

Uses modern ESLint flat config (`eslint.config.mjs`) with:
- `eslint-config-next/core-web-vitals` - Next.js web vitals rules
- `eslint-config-next/typescript` - TypeScript-specific Next.js rules
- Global ignores for `.next/`, `out/`, `build/`, and `next-env.d.ts`

## Important Notes

- This is a **freelance project** for Abe's dental practice
- The codebase is still in initial state with default create-next-app content
- No custom components, API routes, or chatbot functionality implemented yet
- The project uses Next.js 16 which may have different APIs than older versions
- React 19 is used, which has breaking changes from React 18 (automatic JSX runtime, etc.)
