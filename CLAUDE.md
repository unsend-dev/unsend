# Unsend Project Guidelines

## Commands
- **Build**: `pnpm build` (specific: `pnpm build:web`, `pnpm build:editor`)
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