# Job Pilot - Development Setup

## Prerequisites

### Required Software

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **Docker Desktop** - [Download](https://docs.docker.com/desktop/install/windows-install/)
   - Required for local Supabase development
   - Make sure Docker Desktop is running before starting Supabase

## Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Vancloterino/job_pilot_mvp.git
cd job_pilot_mvp
npm install
```

### 2. Set Up Supabase Local Instance

**Start Docker Desktop first**, then:

```bash
# Start local Supabase (requires Docker)
npx supabase start

# This will output your local API keys - copy them!
# Example output:
#   API URL: http://127.0.0.1:54321
#   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
#   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Configure Environment Variables

Copy the example file and update with your Supabase keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and replace the placeholder values with the keys from `npx supabase start`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
ENCRYPTION_KEY=generate-with-command-below
```

**Generate encryption key:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript checks
npm test             # Run tests (coming soon)
```

## Supabase Commands

```bash
npx supabase start      # Start local Supabase
npx supabase stop       # Stop local Supabase
npx supabase status     # Check Supabase status
npx supabase db reset   # Reset database
npx supabase migration new <name>  # Create new migration
```

## Troubleshooting

### "Docker Desktop is not running"

Make sure Docker Desktop is installed and running:

1. Open Docker Desktop
2. Wait for it to fully start (whale icon should be stable)
3. Run `npx supabase start` again

### "Port already in use"

If Supabase fails to start due to port conflicts:

```bash
npx supabase stop
npx supabase start
```

### Environment Variables Not Loading

- Make sure `.env.local` exists (not just `.env.local.example`)
- Restart your development server after changing env vars
- Check that env var names match exactly (case-sensitive)

## Git Hooks

This project uses Husky to run quality checks before commits:

- **pre-commit**: Runs ESLint, Prettier, and TypeScript checks
- **commit-msg**: Enforces Conventional Commits format

**Commit message format:**

```
type(scope): subject

Examples:
  feat: add user authentication
  fix: resolve login bug
  docs: update README
  chore(deps): update dependencies
```

**Valid types:** feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

## Project Structure

```
job_pilot_mvp/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard components
│   │   └── ...
│   ├── lib/             # Utilities and helpers
│   │   ├── supabase/   # Supabase client config
│   │   ├── utils/      # Utility functions
│   │   └── hooks/      # Custom React hooks
│   └── types/          # TypeScript type definitions
├── supabase/            # Supabase config and migrations
├── docs/                # Project documentation
├── .husky/             # Git hooks
└── public/             # Static assets
```

## Next Steps

See [docs/TODO.md](docs/TODO.md) for the complete development roadmap.

Current phase: **Week 1 - Foundation & Setup**

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [Technical Requirements (TRD)](docs/TRD.md)
- [Technical Design (TDD)](docs/TDD.md)
- [Development TODO](docs/TODO.md)
- [AI Development Guide](CLAUDE.md)

## Support

For issues or questions, create an issue on GitHub or contact the development team.
