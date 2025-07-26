# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Build**: `pnpm build` (specific: `pnpm build:web`, `pnpm build:editor`, `pnpm build:marketing`)
- **Lint**: `pnpm lint`
- **Dev**: `pnpm dev` (or `pnpm d` for setup + dev)
- **DB**: `pnpm db:migrate-dev`, `pnpm db:studio`, `pnpm db:push`
- **Test**: Run single test with `pnpm test --filter=web -- -t "test name"`
- **Format**: `pnpm format`

## Code Style
- **Formatting**: Prettier with tailwind plugin
- **Imports**: Group by source (internal/external), alphabetize
- **TypeScript**: Strong typing, avoid `any`, use Zod for validation
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **React**: Functional components with hooks, group related hooks
- **Component Structure**: Props at top, hooks next, helper functions, then JSX
- **Error Handling**: Use try/catch with specific error types
- **API**: Use tRPC for internal, Hono for public API endpoints

Follow Vercel style guides with strict TypeScript. Be thoughtful, write readable code over premature optimization.

## Architecture Overview

Unsend is an open-source email sending infrastructure built as a monorepo with the following structure:

### Core Applications
- **web** (`apps/web`): Main Next.js dashboard application with tRPC API, Prisma ORM, authentication
- **marketing** (`apps/marketing`): Marketing website built with Next.js
- **smtp-server** (`apps/smtp-server`): SMTP server implementation
- **docs** (`apps/docs`): Documentation using Mintlify

### Shared Packages
- **email-editor** (`packages/email-editor`): Rich email editor using TipTap, JSX Email
- **ui** (`packages/ui`): Shared UI components using shadcn/ui and Tailwind
- **sdk** (`packages/sdk`): Client SDK for Unsend API
- **eslint-config**, **typescript-config**, **tailwind-config**: Shared configurations

### Key Technologies
- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: tRPC, Prisma, PostgreSQL, Redis (BullMQ queues)
- **Email**: AWS SES, JSX Email, custom email editor
- **Auth**: NextAuth.js with GitHub/Google providers
- **API**: Hono for public REST API with OpenAPI/Swagger
- **Infrastructure**: Docker, Railway deployment ready

### Development Workflow
- Uses Turbo for monorepo builds and development
- Environment setup with `pnpm dx` (installs deps, starts Docker, runs migrations)
- Database operations prefixed with `pnpm db:`
- Each package has independent linting and building