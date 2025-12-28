# CLAUDE.md - AI Assistant Instructions

**Project:** Job Pilot MVP
**Last Updated:** 2025-12-28
**Status:** Active Development - Phase 1

---

## 🎯 CRITICAL RULES - READ BEFORE EVERY ACTION

### 1. Test-Driven Development (TDD) - MANDATORY

**YOU MUST FOLLOW THIS WORKFLOW FOR EVERY FEATURE:**

```
┌─────────────────────────────────────────────────────────────┐
│                     TDD Red-Green-Refactor                   │
└─────────────────────────────────────────────────────────────┘

Step 1: RED - Write failing test FIRST
   │
   ├─→ Write test that describes desired behavior
   ├─→ Run test - IT MUST FAIL (proves test works)
   └─→ Commit: "test: add failing test for [feature]"

Step 2: GREEN - Make test pass with minimal code
   │
   ├─→ Write simplest code to make test pass
   ├─→ Run test - IT MUST PASS
   └─→ Commit: "feat: implement [feature] to pass test"

Step 3: REFACTOR - Improve code quality
   │
   ├─→ Clean up code, remove duplication
   ├─→ Run tests - ALL MUST STILL PASS
   └─→ Commit: "refactor: improve [feature] implementation"
```

**NEVER write production code without a failing test first!**

### 2. TODO Management - MANDATORY

**YOU MUST UPDATE TODO.md AFTER COMPLETING EACH TASK:**

1. **Before starting work:**
   - Mark task as `[~]` (in progress)
   - Use TodoWrite tool to create tracking todos if task is complex

2. **After completing work:**
   - Mark task as `[x]` (completed)
   - Add completion timestamp
   - Note any blockers or deviations

3. **If blocked:**
   - Mark task as `[!]` (blocked)
   - Add note explaining blocker
   - Create new task for resolving blocker

**Example TODO updates:**
```markdown
- [x] Set up ESLint and Prettier (Completed: 2025-12-28)
- [~] Configure Husky for git hooks (In Progress)
- [!] Set up folder structure (Blocked: waiting for design decision)
- [ ] Initialize local Supabase instance (Not started)
```

### 3. Build Verification - MANDATORY

**AFTER EVERY CHANGE, YOU MUST:**

1. ✅ Run linter: `npm run lint`
2. ✅ Run type check: `npm run type-check`
3. ✅ Run tests: `npm test`
4. ✅ Run build: `npm run build`
5. ✅ Verify in browser (for UI changes)

**If ANY step fails, you MUST fix it before moving to next task.**

---

## 📋 Development Workflow

### Standard Workflow for Each Task

```
1. Read current task from TODO.md
   │
2. Check if task requires tests (most do!)
   │
3. If yes → Follow TDD Red-Green-Refactor
   │
4. If no (e.g., config) → Implement carefully
   │
5. Run build verification (lint, type-check, test, build)
   │
6. Update TODO.md with completion status
   │
7. Commit changes with conventional commit message
   │
8. Move to next task
```

### Conventional Commit Messages

**YOU MUST use these prefixes:**

- `feat:` New feature
- `fix:` Bug fix
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `style:` Formatting, missing semicolons, etc.
- `chore:` Maintenance tasks (deps, config)
- `perf:` Performance improvements

**Examples:**
```bash
git commit -m "test: add failing test for user authentication"
git commit -m "feat: implement user signup with Supabase Auth"
git commit -m "refactor: extract validation logic to separate module"
git commit -m "fix: resolve password validation bug"
```

---

## 🧪 Testing Standards

### What to Test

#### ✅ MUST Test (Priority 0)
- All utility functions
- All validation logic
- All data transformations
- All business logic
- All API route handlers
- All database operations

#### ✅ SHOULD Test (Priority 1)
- React components (user interactions)
- Form submissions
- Error handling
- Edge cases

#### ⚠️ OPTIONAL Test (Priority 2)
- UI styling
- Static content
- Third-party library wrappers

### Test File Structure

```
/src
  /lib
    /utils
      validation.ts
      validation.test.ts  ← Test file next to source
  /components
    /auth
      LoginForm.tsx
      LoginForm.test.tsx  ← Test file next to component
```

### Minimum Test Coverage

- **Phase 1:** 40% coverage (core features)
- **Phase 2:** 60% coverage (before pilot)
- **Phase 3:** 70% coverage (before launch)

**YOU MUST check coverage after each feature:**
```bash
npm run test:coverage
```

---

## 📁 Code Organization Rules

### File Naming Conventions

- **Components:** PascalCase (e.g., `LoginForm.tsx`)
- **Utilities:** camelCase (e.g., `validation.ts`)
- **Types:** PascalCase (e.g., `User.ts`)
- **Tests:** Same as source + `.test.ts` (e.g., `validation.test.ts`)
- **API Routes:** kebab-case folders (e.g., `/api/auth/login/route.ts`)

### Import Order (enforce with ESLint)

```typescript
// 1. React and Next.js imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// 3. Internal absolute imports (@/)
import { Button } from '@/components/ui/Button';
import { validateEmail } from '@/lib/utils/validation';

// 4. Types
import type { User } from '@/types/user';

// 5. Relative imports (only when necessary)
import { localHelper } from './helper';
```

### TypeScript Strictness

**ALWAYS use strict mode:**
```typescript
// tsconfig.json must have:
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**NEVER use `any` type** - Use `unknown` and narrow the type

---

## 🔒 Security Checklist

**BEFORE COMMITTING CODE, VERIFY:**

- [ ] No hardcoded secrets (API keys, passwords)
- [ ] No console.log with sensitive data
- [ ] All user inputs are validated
- [ ] All database queries use parameterized queries
- [ ] File uploads are validated (type, size)
- [ ] Authentication is checked on all protected routes
- [ ] Credentials are encrypted before storage
- [ ] HTTPS is enforced
- [ ] CORS is properly configured

---

## 🚀 Git Workflow

### Branch Strategy

```
main (production)
  │
  └─→ develop (staging)
        │
        └─→ feature/user-authentication
        └─→ feature/job-preferences
        └─→ fix/validation-bug
```

**Current Phase 1: Work directly on `main` (solo dev)**
**Phase 2+: Use feature branches**

### Commit Frequency

**Commit after each meaningful change:**
- ✅ After writing failing test
- ✅ After making test pass
- ✅ After refactoring
- ✅ After completing a TODO task
- ✅ Before switching tasks

**DON'T:**
- ❌ Commit broken code
- ❌ Commit commented-out code
- ❌ Commit large multi-feature changes

---

## 📊 Progress Tracking

### Daily Checklist

**At the start of each work session:**
1. Review TODO.md for current phase/week
2. Identify next 3-5 tasks to complete
3. Use TodoWrite tool to create session todos
4. Start with highest priority incomplete task

**At the end of each work session:**
1. Update TODO.md with completed tasks
2. Commit all changes
3. Run full build verification
4. Note any blockers for next session

### Weekly Review

**Every 7 days:**
1. Review week's progress in TODO.md
2. Update completion percentages
3. Identify blockers and risks
4. Adjust priorities if needed
5. Update this CLAUDE.md if workflow needs adjustment

---

## 🐛 Debugging Protocol

### When Something Breaks

**FOLLOW THIS PROCESS:**

1. **Don't panic** - Read error message carefully
2. **Reproduce** - Can you make it happen again?
3. **Isolate** - What's the minimal code that breaks?
4. **Research** - Check docs, search GitHub issues
5. **Fix** - Write test that reproduces bug (RED)
6. **Fix** - Implement fix to make test pass (GREEN)
7. **Verify** - Run all tests, build succeeds
8. **Document** - Add comment if fix is non-obvious
9. **Commit** - `fix: resolve [bug description]`

### When Stuck (>30 mins)

1. Document the blocker in TODO.md with `[!]`
2. Add detailed notes about what you tried
3. Move to a different task
4. Return later with fresh perspective
5. Consider asking for help if still blocked

---

## 📚 Documentation Standards

### Code Comments

**DO comment:**
- ✅ Complex algorithms
- ✅ Non-obvious business logic
- ✅ Workarounds for library bugs
- ✅ Security-critical sections
- ✅ Public API functions (JSDoc)

**DON'T comment:**
- ❌ Obvious code (e.g., `// increment counter`)
- ❌ Instead of refactoring bad code
- ❌ Commented-out code (delete it!)

### JSDoc for Public Functions

```typescript
/**
 * Validates user email address format
 *
 * @param email - Email address to validate
 * @returns True if email is valid format
 * @throws {ValidationError} If email is empty
 *
 * @example
 * ```typescript
 * validateEmail('user@example.com'); // true
 * validateEmail('invalid'); // false
 * ```
 */
export function validateEmail(email: string): boolean {
  // Implementation
}
```

---

## 🎨 UI/UX Guidelines

### Accessibility (WCAG 2.1 AA)

**EVERY UI component must:**
- [ ] Have proper ARIA labels
- [ ] Be keyboard navigable
- [ ] Have sufficient color contrast (4.5:1)
- [ ] Have focus indicators
- [ ] Work with screen readers

### Loading States

**NEVER leave user wondering:**
- ✅ Show spinner for async operations
- ✅ Disable buttons during submission
- ✅ Show progress for long operations
- ✅ Use skeleton loaders for content

### Error Handling

**User-friendly error messages:**
- ❌ "Error: 500 Internal Server Error"
- ✅ "Something went wrong. Please try again in a moment."

**Actionable errors:**
- ❌ "Invalid input"
- ✅ "Email must be in format: user@example.com"

---

## 🔄 Refactoring Rules

### When to Refactor

**Refactor when you notice:**
- Duplicate code (DRY principle)
- Functions longer than 50 lines
- More than 3 levels of nesting
- Unclear variable names
- Complex conditionals

### How to Refactor Safely

```
1. Ensure all tests pass (GREEN state)
   │
2. Make ONE refactoring change
   │
3. Run tests - they should still pass
   │
4. Commit: "refactor: [what you changed]"
   │
5. Repeat for next refactoring
```

**NEVER refactor and add features at the same time!**

---

## 📦 Dependency Management

### Before Adding a Dependency

**ASK YOURSELF:**
1. Is this really needed? Can I build it myself quickly?
2. Is it actively maintained? (Last commit within 6 months)
3. Does it have good TypeScript support?
4. Is it lightweight? (Check bundle size)
5. Does it have security vulnerabilities? (`npm audit`)

### Preferred Libraries

**Use these (already vetted):**
- ✅ Supabase client
- ✅ Playwright
- ✅ Zod (validation)
- ✅ React Hook Form
- ✅ Tailwind CSS
- ✅ shadcn/ui components
- ✅ date-fns (dates)
- ✅ Sentry (errors)

**Avoid these (too heavy or outdated):**
- ❌ Moment.js (use date-fns)
- ❌ Lodash (use native JS)
- ❌ jQuery (use vanilla JS)
- ❌ Bootstrap (use Tailwind)

---

## 🚨 Critical Paths - Extra Attention

**These features are CRITICAL - Test extra thoroughly:**

1. **User Authentication** - Security sensitive
2. **Credential Storage** - Must be encrypted properly
3. **Automation Engine** - Core product value
4. **Payment Flow** - Money involved (Phase 3)
5. **Application Submission** - Must be reliable

**For these features:**
- Write more tests (unit, integration, e2e)
- Manual testing required
- Security review required
- Performance testing required

---

## 📈 Performance Budgets

**MONITOR THESE METRICS:**

| Metric | Budget | How to Check |
|--------|--------|--------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Bundle Size (JS) | < 200kb | `npm run build` |
| Lighthouse Score | > 90 | Chrome DevTools |
| API Response Time | < 500ms | Network tab |

**If you exceed budget:**
1. Investigate what's causing slowness
2. Optimize (lazy load, code split, cache)
3. Re-measure
4. Document trade-offs if can't fix

---

## 🎯 Quality Gates

### Before Marking TODO as Complete

**ALL must be ✅:**
- [ ] Tests written and passing
- [ ] Linter passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Manually tested in browser
- [ ] TODO.md updated
- [ ] Code committed with conventional message
- [ ] No console.logs left in code
- [ ] No TypeScript `any` types
- [ ] Documentation updated if public API changed

### Before Pushing to Main

**ALL must be ✅:**
- [ ] All quality gates above ✅
- [ ] All tests in repo pass
- [ ] No secrets in code
- [ ] No breaking changes (or documented)
- [ ] Dependencies up to date (no critical vulnerabilities)

### Before Deploying to Production

**ALL must be ✅:**
- [ ] All phase requirements complete (see PRD)
- [ ] End-to-end tests pass
- [ ] Performance budgets met
- [ ] Security review complete
- [ ] Backup procedures tested
- [ ] Rollback plan documented
- [ ] Monitoring and alerts configured

---

## 🤝 Communication Standards

### When Reporting Progress

**ALWAYS include:**
1. What was completed (with TODO references)
2. What's in progress
3. What's blocked (if any)
4. Estimated time to next milestone
5. Any risks or concerns

**Example:**
```
✅ Completed:
- [Week 1] Set up ESLint and Prettier
- [Week 1] Configure Husky for git hooks
- [Week 1] Set up folder structure

🔄 In Progress:
- [Week 1] Supabase CLI setup (50% done)

🚧 Blocked:
- None

⏱️ Next Milestone:
- Complete Week 1 tasks (2 days remaining)

⚠️ Risks:
- Supabase local setup more complex than expected
```

### When Asking for Help

**PROVIDE:**
1. What you're trying to do
2. What you've tried
3. Error messages (full stack trace)
4. Relevant code snippets
5. What you've researched

---

## 🎓 Learning & Improvement

### After Completing a Feature

**REFLECT:**
1. What went well?
2. What was harder than expected?
3. What would you do differently?
4. What did you learn?
5. Update this CLAUDE.md with lessons

### Code Review Checklist (Self-Review)

**Before considering code "done":**
- [ ] Does this code do what it's supposed to do?
- [ ] Can I understand it in 6 months?
- [ ] Is it the simplest solution?
- [ ] Are edge cases handled?
- [ ] Is it tested?
- [ ] Is it secure?
- [ ] Is it performant?
- [ ] Would I be proud to show this to another developer?

---

## 🔧 Troubleshooting Common Issues

### "Tests are flaky"
- Check for timing issues (use `waitFor`)
- Check for state pollution between tests
- Ensure tests are isolated (no shared state)

### "Build is slow"
- Check bundle size
- Ensure dynamic imports for heavy components
- Check for circular dependencies

### "Type errors everywhere"
- Run `npm run type-check` to see all errors
- Fix one file at a time
- Don't use `@ts-ignore` - fix the root cause

### "Supabase connection fails"
- Check environment variables
- Ensure Supabase instance is running
- Check network/firewall settings

---

## 📋 Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Quality Checks
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript check
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Check coverage

# Database
npx supabase start       # Start local Supabase
npx supabase status      # Check Supabase status
npx supabase db reset    # Reset database
npx supabase migration new [name]  # Create migration

# Git
git status               # Check status
git add .                # Stage all changes
git commit -m "type: message"  # Commit
git push                 # Push to remote
```

---

## 🎯 Current Focus

**Phase:** Phase 1 - Local Development (Weeks 1-6)
**Week:** Week 1 - Foundation & Setup
**Current Sprint Goal:** Complete project setup and Supabase configuration

**Next 3 Priorities:**
1. Complete ESLint/Prettier setup
2. Initialize Supabase locally
3. Create database schema

---

## 📝 Notes Section

**Add notes here as you work:**

### 2025-12-28
- Created CLAUDE.md to standardize development workflow
- Established TDD as mandatory practice
- Set up TODO tracking requirements

---

## ⚡ Remember

> "Make it work, make it right, make it fast" - Kent Beck

1. **Red-Green-Refactor** is not optional
2. **TODO.md** is your source of truth
3. **Tests** are your safety net
4. **Quality over speed** - Do it right the first time
5. **Document as you go** - Future you will thank present you

---

**This is a living document. Update it as you learn!**

Last reviewed: 2025-12-28
Next review: End of Week 1 (Phase 1)
