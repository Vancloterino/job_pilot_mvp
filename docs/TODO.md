# Job Pilot - Development TODO

**Last Updated:** 2025-12-28
**Current Phase:** Phase 1 - Local Development
**Target Completion:** 4-6 weeks

---

## Phase 1: Local Development & MVP (Weeks 1-6)

### Week 1: Foundation & Setup

#### Project Setup

- [x] Initialize Next.js project with TypeScript (Completed: 2025-12-28)
- [x] Configure Tailwind CSS (Completed: 2025-12-28)
- [x] Set up ESLint and Prettier (Completed: 2025-12-28)
- [x] Configure Husky for git hooks (Completed: 2025-12-28)
- [x] Set up folder structure (Completed: 2025-12-28)
  - [x] `/app` - Next.js app router pages
  - [x] `/components` - React components
  - [x] `/lib` - Utilities and helpers
  - [x] `/automation` - Playwright automation engine (folder created)
  - [x] `/types` - TypeScript type definitions
  - [x] `/docs` - Documentation

#### Supabase Setup

- [ ] Create Supabase account and project
- [ ] Install Supabase CLI
- [ ] Initialize local Supabase instance
- [ ] Configure Supabase client in Next.js
- [ ] Set up environment variables
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

#### Database Schema

- [ ] Create `users` table (handled by Supabase Auth)
- [ ] Create `profiles` table
  - [ ] id (uuid, primary key)
  - [ ] user_id (uuid, foreign key)
  - [ ] full_name (text)
  - [ ] phone (text)
  - [ ] resume_url (text)
  - [ ] cover_letter_url (text)
  - [ ] created_at, updated_at (timestamps)
- [ ] Create `job_preferences` table
  - [ ] id (uuid, primary key)
  - [ ] user_id (uuid, foreign key)
  - [ ] job_titles (text[])
  - [ ] locations (text[])
  - [ ] keywords_include (text[])
  - [ ] keywords_exclude (text[])
  - [ ] remote_preference (enum)
  - [ ] employment_type (enum)
  - [ ] min_salary (integer)
  - [ ] max_salary (integer)
  - [ ] is_active (boolean)
  - [ ] created_at, updated_at (timestamps)
- [ ] Create `job_board_credentials` table
  - [ ] id (uuid, primary key)
  - [ ] user_id (uuid, foreign key)
  - [ ] platform (enum: indeed, linkedin, etc.)
  - [ ] username (text, encrypted)
  - [ ] password (text, encrypted)
  - [ ] created_at, updated_at (timestamps)
- [ ] Create `applications` table
  - [ ] id (uuid, primary key)
  - [ ] user_id (uuid, foreign key)
  - [ ] job_title (text)
  - [ ] company_name (text)
  - [ ] job_board (enum)
  - [ ] job_url (text)
  - [ ] location (text)
  - [ ] salary_range (text)
  - [ ] status (enum: pending, submitted, failed, interview, rejected, offer)
  - [ ] failure_reason (text)
  - [ ] applied_at (timestamp)
  - [ ] created_at, updated_at (timestamps)
- [ ] Create `automation_runs` table
  - [ ] id (uuid, primary key)
  - [ ] user_id (uuid, foreign key)
  - [ ] status (enum: running, completed, failed)
  - [ ] jobs_found (integer)
  - [ ] applications_submitted (integer)
  - [ ] applications_failed (integer)
  - [ ] error_message (text)
  - [ ] started_at (timestamp)
  - [ ] completed_at (timestamp)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create database indexes for performance
- [ ] Write migration scripts

#### Storage Setup

- [ ] Configure Supabase Storage bucket for resumes
- [ ] Configure Supabase Storage bucket for cover letters
- [ ] Set up storage policies (user can only access their own files)
- [ ] Test file upload/download

---

### Week 2: Authentication & User Profile

#### Authentication Pages

- [ ] Create `/app/auth/signup` page
  - [ ] Email input with validation
  - [ ] Password input with strength indicator
  - [ ] Confirm password field
  - [ ] Terms of service checkbox
  - [ ] Sign up button with loading state
  - [ ] Error handling and display
  - [ ] Redirect to onboarding after signup
- [ ] Create `/app/auth/login` page
  - [ ] Email input
  - [ ] Password input with show/hide toggle
  - [ ] "Remember me" option (optional)
  - [ ] Login button with loading state
  - [ ] "Forgot password?" link
  - [ ] Redirect to dashboard after login
- [ ] Create `/app/auth/reset-password` page
  - [ ] Email input
  - [ ] Send reset link button
  - [ ] Success message
  - [ ] Handle reset token from email
- [ ] Create auth helper functions
  - [ ] `signUp(email, password)`
  - [ ] `signIn(email, password)`
  - [ ] `signOut()`
  - [ ] `resetPassword(email)`
  - [ ] `updatePassword(newPassword)`
  - [ ] `getCurrentUser()`

#### Session Management

- [ ] Implement session persistence
- [ ] Implement automatic token refresh
- [ ] Create protected route middleware
- [ ] Redirect unauthenticated users to login
- [ ] Redirect authenticated users away from auth pages

#### Profile Management

- [ ] Create `ProfileForm` component
  - [ ] Full name input
  - [ ] Phone number input (with formatting)
  - [ ] Email display (read-only)
  - [ ] Save button
  - [ ] Loading and error states
- [ ] Create profile API routes
  - [ ] `GET /api/profile` - Fetch user profile
  - [ ] `PUT /api/profile` - Update user profile
- [ ] Implement profile creation on signup (trigger)
- [ ] Add form validation (Zod or Yup)

---

### Week 3: Resume Upload & Job Preferences

#### Resume & Cover Letter Upload

- [ ] Create `FileUpload` component
  - [ ] Drag-and-drop zone
  - [ ] File picker button
  - [ ] File type validation (PDF, DOCX only)
  - [ ] File size validation (max 5MB)
  - [ ] Upload progress indicator
  - [ ] Preview uploaded file (name, size, upload date)
  - [ ] Replace file button
  - [ ] Delete file button
  - [ ] Download file button
- [ ] Create file upload API routes
  - [ ] `POST /api/profile/resume` - Upload resume
  - [ ] `POST /api/profile/cover-letter` - Upload cover letter
  - [ ] `DELETE /api/profile/resume` - Delete resume
  - [ ] `DELETE /api/profile/cover-letter` - Delete cover letter
  - [ ] `GET /api/profile/resume` - Download resume
  - [ ] `GET /api/profile/cover-letter` - Download cover letter
- [ ] Implement file validation on server
- [ ] Implement virus scanning (ClamAV or similar) - optional for MVP
- [ ] Handle upload errors gracefully
- [ ] Test with various file types and sizes

#### Job Preferences Form

- [ ] Create `JobPreferencesForm` component
  - [ ] Job titles input (tag/chip input, 1-5 items)
  - [ ] Locations input (tag/chip input, 1-10 items)
  - [ ] Keywords to include (tag input, optional)
  - [ ] Keywords to exclude (tag input, optional)
  - [ ] Remote preference dropdown (Remote Only, Hybrid, On-Site, Any)
  - [ ] Employment type dropdown (Full-Time, Part-Time, Contract, Any)
  - [ ] Minimum salary input (number, optional)
  - [ ] Maximum salary input (number, optional)
  - [ ] Active toggle (enable/disable preferences)
  - [ ] Save button
  - [ ] Reset button
  - [ ] Form validation
  - [ ] Loading and error states
- [ ] Create preferences API routes
  - [ ] `GET /api/preferences` - Fetch preferences
  - [ ] `PUT /api/preferences` - Save/update preferences
  - [ ] `POST /api/preferences` - Create initial preferences
- [ ] Implement validation logic
  - [ ] At least one job title required
  - [ ] At least one location required
  - [ ] Min salary < max salary
  - [ ] Trim whitespace from inputs
- [ ] Add helpful placeholders and tooltips
- [ ] Test edge cases (empty values, special characters, etc.)

#### Job Board Credentials

- [ ] Create `CredentialsForm` component
  - [ ] Platform selector (Indeed for now)
  - [ ] Username/email input
  - [ ] Password input with show/hide toggle
  - [ ] "Test Connection" button
  - [ ] Save credentials button
  - [ ] Success/error messages
  - [ ] Security disclaimer text
- [ ] Create credentials API routes
  - [ ] `POST /api/credentials` - Save credentials (encrypted)
  - [ ] `GET /api/credentials` - List connected platforms
  - [ ] `DELETE /api/credentials/:platform` - Remove credentials
  - [ ] `POST /api/credentials/test` - Test credentials validity
- [ ] Implement encryption for credentials
  - [ ] Use crypto library for AES encryption
  - [ ] Store encryption key in environment variable
  - [ ] Never log or expose passwords
- [ ] Implement credential testing (lightweight Indeed login check)
- [ ] Add security warnings and explanations

---

### Week 4: Automation Engine (Part 1)

#### Playwright Setup

- [ ] Install Playwright and dependencies
- [ ] Configure Playwright for headless mode
- [ ] Set up browser context and page management
- [ ] Configure user agent and headers
- [ ] Test basic navigation to Indeed

#### Indeed Integration

- [ ] Research Indeed Easy Apply flow
  - [ ] Document login flow
  - [ ] Document job search flow
  - [ ] Document Easy Apply button detection
  - [ ] Document application form fields
  - [ ] Document success/failure indicators
- [ ] Implement Indeed login automation
  - [ ] Navigate to login page
  - [ ] Enter credentials
  - [ ] Handle two-factor authentication (if present)
  - [ ] Detect login success/failure
  - [ ] Handle CAPTCHA detection (fail gracefully)
  - [ ] Maintain session cookies
- [ ] Implement job search automation
  - [ ] Build search URL with query parameters
  - [ ] Apply filters (location, remote, job type, salary)
  - [ ] Scrape job listing cards
  - [ ] Extract job details (title, company, location, URL, salary)
  - [ ] Detect Easy Apply badge
  - [ ] Pagination handling (load more results)
- [ ] Test search with various preferences

#### Application Submission Logic (Part 1)

- [ ] Create `AutomationEngine` class
  - [ ] Constructor accepting user credentials and preferences
  - [ ] `initialize()` - Set up browser
  - [ ] `authenticate()` - Log in to Indeed
  - [ ] `searchJobs()` - Find matching jobs
  - [ ] `filterJobs()` - Apply client-side filters
  - [ ] `applyToJob()` - Submit single application
  - [ ] `cleanup()` - Close browser
- [ ] Implement job filtering logic
  - [ ] Skip jobs already applied to (check database)
  - [ ] Skip jobs without Easy Apply
  - [ ] Skip jobs with excluded keywords
  - [ ] Skip jobs below minimum salary
  - [ ] Log skipped jobs with reasons

---

### Week 5: Automation Engine (Part 2) & Testing

#### Application Submission Logic (Part 2)

- [ ] Implement Easy Apply form handling
  - [ ] Click Easy Apply button
  - [ ] Detect form fields (name, email, phone, resume, cover letter)
  - [ ] Fill in user information
  - [ ] Upload resume file
  - [ ] Upload cover letter (if available)
  - [ ] Handle additional questions (skip or choose default)
  - [ ] Submit application
  - [ ] Detect success confirmation
  - [ ] Handle errors and retries
- [ ] Implement progress tracking
  - [ ] Emit events for job found, application started, application completed, application failed
  - [ ] Update `automation_runs` table in real-time
  - [ ] Update `applications` table for each attempt
- [ ] Implement error handling
  - [ ] Try-catch around each application attempt
  - [ ] Log detailed error messages
  - [ ] Continue processing after failures
  - [ ] Retry logic (max 2 retries per job)
  - [ ] Timeout handling (max 2 minutes per application)
- [ ] Implement rate limiting
  - [ ] Delay between applications (30-60 seconds)
  - [ ] Respect Indeed rate limits
  - [ ] Detect and handle rate limit responses

#### Manual Trigger API

- [ ] Create `POST /api/automation/run` endpoint
  - [ ] Validate user is authenticated
  - [ ] Check prerequisites (resume, preferences, credentials)
  - [ ] Start automation in background process
  - [ ] Return run ID immediately
  - [ ] Stream progress updates via Server-Sent Events (SSE) or WebSockets
- [ ] Create `GET /api/automation/status/:runId` endpoint
  - [ ] Return current status of automation run
  - [ ] Return progress metrics (jobs found, applied, failed)
- [ ] Create `POST /api/automation/pause/:runId` endpoint
  - [ ] Gracefully stop automation
  - [ ] Save progress
- [ ] Handle concurrent runs (prevent multiple runs for same user)

#### Testing

- [ ] Create test Indeed account
- [ ] Test full automation flow end-to-end
  - [ ] Login
  - [ ] Search
  - [ ] Apply to 5-10 jobs
  - [ ] Verify applications submitted successfully
- [ ] Test error scenarios
  - [ ] Invalid credentials
  - [ ] CAPTCHA triggered
  - [ ] Network failure
  - [ ] Session expiration
  - [ ] Job already applied
- [ ] Test edge cases
  - [ ] No matching jobs found
  - [ ] All jobs already applied
  - [ ] Job removed before application
- [ ] Write unit tests for filtering logic
- [ ] Write integration tests for automation engine

---

### Week 6: Dashboard & Polish

#### Application Dashboard

- [ ] Create `/app/dashboard` page
  - [ ] Welcome message for new users
  - [ ] Stats cards component
    - [ ] Total applications
    - [ ] Success rate
    - [ ] Interviews
    - [ ] Offers
  - [ ] Quick actions section
    - [ ] "Run Auto-Apply" button
    - [ ] "Edit Preferences" button
    - [ ] Last run timestamp
  - [ ] Applications table component
  - [ ] Empty state (no applications yet)
- [ ] Create `ApplicationsTable` component
  - [ ] Columns: Company, Job Title, Date Applied, Status, Actions
  - [ ] Sortable columns (date, company, title)
  - [ ] Status filter tabs (All, Submitted, Failed, Interview, etc.)
  - [ ] Date range filter
  - [ ] Search input (filter by company or title)
  - [ ] Pagination (20 per page)
  - [ ] Loading skeleton
  - [ ] Row click → application detail
- [ ] Create `ApplicationCard` component (mobile view)
  - [ ] Company name and logo
  - [ ] Job title
  - [ ] Date and status badge
  - [ ] Tap to view details
- [ ] Create status badge component with color coding
  - [ ] Pending: Gray
  - [ ] Submitted: Green
  - [ ] Failed: Red
  - [ ] Interview: Blue
  - [ ] Rejected: Orange
  - [ ] Offer: Purple
- [ ] Create applications API routes
  - [ ] `GET /api/applications` - List with filters, search, pagination
  - [ ] `GET /api/applications/:id` - Single application
  - [ ] `PUT /api/applications/:id` - Update status
  - [ ] `DELETE /api/applications/:id` - Delete application
  - [ ] `GET /api/applications/stats` - Dashboard statistics

#### Application Detail Page

- [ ] Create `/app/applications/[id]` page
  - [ ] Company name (large, bold)
  - [ ] Job title
  - [ ] Location
  - [ ] Salary range (if available)
  - [ ] Date applied
  - [ ] Current status with badge
  - [ ] Link to original job posting (opens in new tab)
  - [ ] Application method (Easy Apply)
  - [ ] Failure reason (if failed)
  - [ ] Resume used (download link)
  - [ ] Notes section (editable by user)
  - [ ] Status update dropdown
  - [ ] Delete button (with confirmation)
  - [ ] Back to dashboard button

#### Automation Trigger UI

- [ ] Create `AutomationTrigger` component
  - [ ] Large "Run Auto-Apply" button
  - [ ] Prerequisites checklist
    - [ ] ✓ Resume uploaded
    - [ ] ✓ Preferences set
    - [ ] ✓ Indeed connected
  - [ ] Disable button if prerequisites not met
  - [ ] Click → open progress modal
- [ ] Create `AutomationProgressModal` component
  - [ ] Real-time progress updates
  - [ ] Jobs found counter
  - [ ] Applications submitted counter
  - [ ] Applications failed counter
  - [ ] Live log feed (scrollable)
  - [ ] Progress bar
  - [ ] Pause button
  - [ ] Close button (can close, automation continues)
  - [ ] Success summary on completion
  - [ ] Error summary on failure
- [ ] Implement real-time updates (SSE or polling)

#### Navigation & Layout

- [ ] Create app layout component
  - [ ] Top navigation bar
    - [ ] Logo
    - [ ] Dashboard link
    - [ ] Applications link
    - [ ] Settings link
    - [ ] User menu (profile, logout)
  - [ ] Responsive hamburger menu for mobile
  - [ ] Footer (links to help, privacy, terms)
- [ ] Create settings navigation
  - [ ] Tabs: Profile, Documents, Preferences, Credentials, Account
- [ ] Add loading states throughout app
- [ ] Add error boundaries for graceful error handling

#### Onboarding Flow

- [ ] Create `/app/onboarding` page
  - [ ] Multi-step wizard (4 steps)
  - [ ] Step 1: Welcome & upload resume
  - [ ] Step 2: Set job preferences
  - [ ] Step 3: Connect Indeed account
  - [ ] Step 4: Success & call-to-action (run first automation)
  - [ ] Progress indicator
  - [ ] Next/back buttons
  - [ ] Skip option (go to dashboard)
- [ ] Redirect new users to onboarding
- [ ] Mark onboarding complete in database

#### Polish & UX Improvements

- [ ] Add animations (page transitions, button clicks)
- [ ] Add loading skeletons for data fetching
- [ ] Improve form validation messages (user-friendly)
- [ ] Add tooltips for complex features
- [ ] Add empty states for all lists
- [ ] Improve error messages (actionable, clear)
- [ ] Add success toasts for user actions
- [ ] Mobile responsive testing and fixes
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility audit (keyboard navigation, screen readers)
- [ ] Performance optimization (lazy loading, code splitting)

#### Documentation

- [ ] Write README with setup instructions
- [ ] Document environment variables
- [ ] Create user guide (how to use the app)
- [ ] Create troubleshooting guide
- [ ] Write contribution guidelines (if open source)

#### Testing & QA

- [ ] End-to-end testing with test users
  - [ ] Signup flow
  - [ ] Complete onboarding
  - [ ] Run automation
  - [ ] View dashboard
  - [ ] Update application statuses
- [ ] Bug fixes from testing
- [ ] Performance testing (load times, large datasets)
- [ ] Security review
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  - [ ] CSRF protection
  - [ ] Rate limiting
  - [ ] Input sanitization

---

## Phase 2: Pilot Deployment (Weeks 7-12)

### Week 7: Deployment Setup

#### Infrastructure

- [ ] Create Vercel account and project
- [ ] Connect GitHub repository to Vercel
- [ ] Configure Vercel project settings
  - [ ] Environment variables
  - [ ] Build settings
  - [ ] Domain settings
- [ ] Deploy frontend to Vercel
- [ ] Set up preview deployments for PRs
- [ ] Migrate Supabase to cloud project
  - [ ] Create production Supabase project
  - [ ] Migrate database schema
  - [ ] Migrate data (if any)
  - [ ] Update environment variables
  - [ ] Test connection
- [ ] Set up Railway or Render account
- [ ] Deploy automation service to Railway/Render
  - [ ] Create Dockerfile for automation service
  - [ ] Configure environment variables
  - [ ] Set up health check endpoint
  - [ ] Test deployment
- [ ] Set up staging environment
  - [ ] Separate Vercel project
  - [ ] Separate Supabase project
  - [ ] Separate Railway/Render service

#### CI/CD

- [ ] Set up GitHub Actions
  - [ ] Lint on PR
  - [ ] Run tests on PR
  - [ ] Deploy to staging on merge to `develop`
  - [ ] Deploy to production on merge to `main`
- [ ] Configure deployment notifications (Slack or email)

#### Monitoring & Logging

- [ ] Set up Sentry account
- [ ] Install Sentry SDK in Next.js
- [ ] Install Sentry SDK in automation service
- [ ] Configure error alerting
- [ ] Test error tracking
- [ ] Set up Vercel Analytics
- [ ] Set up Supabase monitoring
- [ ] Set up Railway/Render logging
- [ ] Create monitoring dashboard

---

### Week 8: Scheduled Automation & Reliability

#### Scheduled Automation

- [ ] Implement cron job trigger in Railway/Render
- [ ] Create `scheduledAutomationJob` function
  - [ ] Fetch all active users
  - [ ] Check daily limits
  - [ ] Run automation for each user sequentially
  - [ ] Log results
- [ ] Create automation scheduling API
  - [ ] `PUT /api/automation/schedule` - Set schedule preferences
  - [ ] `GET /api/automation/schedule` - Get current schedule
- [ ] Create `ScheduleSettings` UI component
  - [ ] Enable/disable toggle
  - [ ] Time picker
  - [ ] Frequency selector (daily, every 2 days, weekly)
  - [ ] Next run display
  - [ ] Save button
- [ ] Test scheduled automation locally
- [ ] Test scheduled automation in production

#### Retry Logic & Error Handling

- [ ] Implement automatic retry for failed applications
  - [ ] Max 3 retries per application
  - [ ] Exponential backoff (1 min, 5 min, 15 min)
  - [ ] Store retry count in database
- [ ] Implement circuit breaker pattern
  - [ ] Stop automation if too many consecutive failures
  - [ ] Notify user and admin
- [ ] Improve error messages
  - [ ] User-friendly explanations
  - [ ] Suggested actions
- [ ] Create error logs dashboard (admin only)

#### Health Checks & Monitoring

- [ ] Create `/api/health` endpoint
  - [ ] Check database connection
  - [ ] Check Supabase storage
  - [ ] Check automation service
  - [ ] Return status and metrics
- [ ] Set up uptime monitoring (UptimeRobot or similar)
- [ ] Set up alerting for downtime
- [ ] Create status page (public or internal)

---

### Week 9: Notifications & User Engagement

#### Email Infrastructure

- [ ] Choose email service (Resend or SendGrid)
- [ ] Set up email service account
- [ ] Configure DNS (SPF, DKIM, DMARC)
- [ ] Verify domain
- [ ] Install email SDK
- [ ] Create email templates
  - [ ] Daily summary template
  - [ ] Weekly digest template
  - [ ] Failure alert template
  - [ ] Welcome email template
  - [ ] Password reset template

#### Email Notifications

- [ ] Implement daily summary email
  - [ ] Trigger: After each automation run
  - [ ] Content: Applications submitted, success rate, top companies
  - [ ] CTA: View dashboard
  - [ ] Unsubscribe link
- [ ] Implement weekly digest email
  - [ ] Trigger: Every Monday morning
  - [ ] Content: Week's stats, interview invitations, motivational message
  - [ ] CTA: View dashboard, adjust preferences
- [ ] Implement failure alert email
  - [ ] Trigger: Automation failure
  - [ ] Content: What went wrong, suggested fix, support link
  - [ ] CTA: Update credentials, contact support
- [ ] Implement welcome email
  - [ ] Trigger: After signup
  - [ ] Content: Welcome message, getting started guide, tips
  - [ ] CTA: Complete onboarding
- [ ] Create notification preferences UI
  - [ ] Daily summary toggle
  - [ ] Weekly digest toggle
  - [ ] Failure alerts (always on, but configurable)
  - [ ] Save preferences

#### In-App Notifications

- [ ] Create notification system
  - [ ] Database table for notifications
  - [ ] API endpoints (list, mark as read, delete)
- [ ] Create notification bell icon in nav
  - [ ] Unread count badge
  - [ ] Dropdown with recent notifications
  - [ ] Mark all as read button
- [ ] Trigger notifications for key events
  - [ ] Automation completed
  - [ ] Automation failed
  - [ ] Daily limit reached
  - [ ] New interview invitation detected (future)

---

### Week 10: Quality Controls & Guardrails

#### Application Limits

- [ ] Implement daily application limit enforcement
  - [ ] Check limit before each application
  - [ ] Stop automation when limit reached
  - [ ] Store daily count in database (reset at midnight)
  - [ ] Show remaining applications in UI
- [ ] Create limit adjustment UI
  - [ ] Slider for daily limit (5-50)
  - [ ] Warning if too high (spam risk)
  - [ ] Save and apply immediately
- [ ] Implement limit reset at midnight (user's timezone)

#### Quality Filters

- [ ] Implement minimum salary filter
  - [ ] Skip jobs below user's minimum
  - [ ] Log skipped jobs
- [ ] Implement keyword exclusion filter
  - [ ] Check job title and description for excluded keywords
  - [ ] Skip matches
  - [ ] Log skipped jobs
- [ ] Implement duplicate detection
  - [ ] Check if already applied to same company+title
  - [ ] Skip duplicates
  - [ ] Log skipped jobs
- [ ] Create "Skipped Jobs" view
  - [ ] Table similar to applications
  - [ ] Show skip reason
  - [ ] Option to manually apply
  - [ ] Option to adjust preferences

#### Application Preview (Optional)

- [ ] Create preview mode toggle
  - [ ] If enabled, queue jobs for review before applying
  - [ ] Show preview list with approve/reject buttons
  - [ ] Bulk approve option
- [ ] This may be Phase 3 feature if too complex

---

### Week 11: Feedback System & Pilot Preparation

#### Feedback System

- [ ] Create feedback database table
  - [ ] user_id, category, message, screenshot_url, created_at
- [ ] Create `POST /api/feedback` endpoint
  - [ ] Accept feedback data
  - [ ] Save to database
  - [ ] Send notification to admin (email or Slack)
- [ ] Create feedback form component
  - [ ] Category dropdown (Bug, Feature Request, General)
  - [ ] Message textarea
  - [ ] Optional screenshot upload
  - [ ] Submit button
  - [ ] Success confirmation
- [ ] Add feedback button to app (floating or in menu)
- [ ] Create admin feedback dashboard
  - [ ] List all feedback
  - [ ] Filter by category
  - [ ] Mark as resolved
  - [ ] Reply to user (future)

#### User Research Tools

- [ ] Set up user interview scheduling (Calendly or similar)
- [ ] Create feedback collection plan
  - [ ] Weekly check-in emails
  - [ ] In-app satisfaction surveys (optional)
  - [ ] Feature voting board (Canny or similar) - optional
- [ ] Create analytics tracking
  - [ ] Page views
  - [ ] Button clicks (especially "Run Auto-Apply")
  - [ ] Feature usage
  - [ ] Conversion funnel (signup → onboarding → first run)

#### Pilot User Onboarding

- [ ] Create invitation email template
- [ ] Create welcome guide for pilot users
  - [ ] What to expect
  - [ ] How to provide feedback
  - [ ] Known limitations
  - [ ] Support contact
- [ ] Create dedicated Slack or Discord channel for pilot users
- [ ] Prepare FAQ document for pilot users

---

### Week 12: Pilot Launch & Iteration

#### Pre-Launch Checklist

- [ ] Full QA pass on staging
- [ ] Security audit
- [ ] Performance testing
- [ ] Backup procedures tested
- [ ] Monitoring and alerts configured
- [ ] Support email set up (support@jobpilot.com)
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Legal review (optional, but recommended)

#### Pilot Launch

- [ ] Deploy to production
- [ ] Smoke test critical paths
- [ ] Invite first 10 pilot users
  - [ ] Friends and colleagues
  - [ ] Tech-savvy early adopters
- [ ] Monitor closely for first 48 hours
- [ ] Fix critical bugs immediately
- [ ] Collect initial feedback

#### Iteration & Refinement

- [ ] Weekly feedback review sessions
- [ ] Prioritize and fix top bugs
- [ ] Implement quick wins from feedback
- [ ] Monitor key metrics
  - [ ] Activation rate (completed onboarding)
  - [ ] Application success rate
  - [ ] Daily active users
  - [ ] Retention (Day 1, 7, 30)
- [ ] Expand pilot to 50 users gradually
- [ ] Conduct user interviews (5-10 users)
- [ ] Validate willingness to pay
  - [ ] Ask directly in interviews
  - [ ] Gauge feature value
  - [ ] Test pricing messaging
- [ ] Prepare for Phase 3 (payments)

---

## Phase 3: Commercialization (Weeks 13+)

### Week 13-14: Stripe Integration & Subscriptions

#### Stripe Setup

- [ ] Create Stripe account
- [ ] Set up test mode
- [ ] Configure products and pricing
  - [ ] Free tier (5 applications/day)
  - [ ] Pro tier ($29/month, 25 applications/day)
  - [ ] Premium tier ($49/month, 50 applications/day)
  - [ ] Annual pricing (17% discount)
- [ ] Install Stripe SDK
- [ ] Configure webhook endpoint
- [ ] Test webhooks locally (Stripe CLI)

#### Subscription Flow

- [ ] Create pricing page (`/pricing`)
  - [ ] Three-tier comparison table
  - [ ] Feature breakdown
  - [ ] FAQ section
  - [ ] CTA buttons for each tier
- [ ] Implement Stripe Checkout
  - [ ] `POST /api/stripe/create-checkout-session`
  - [ ] Return Checkout URL
  - [ ] Redirect user to Stripe Checkout
  - [ ] Handle success redirect
  - [ ] Handle cancel redirect
- [ ] Implement webhook handling
  - [ ] `POST /api/webhooks/stripe`
  - [ ] `checkout.session.completed` - Create subscription
  - [ ] `customer.subscription.updated` - Update subscription
  - [ ] `customer.subscription.deleted` - Cancel subscription
  - [ ] `invoice.payment_succeeded` - Record payment
  - [ ] `invoice.payment_failed` - Handle failed payment
- [ ] Implement Stripe Billing Portal
  - [ ] `GET /api/stripe/create-portal-session`
  - [ ] Return portal URL
  - [ ] Add "Manage Subscription" button in settings
- [ ] Create `subscriptions` database table
  - [ ] user_id, stripe_customer_id, stripe_subscription_id
  - [ ] plan (free, pro, premium)
  - [ ] status (active, canceled, past_due)
  - [ ] current_period_end
  - [ ] created_at, updated_at
- [ ] Implement tier enforcement
  - [ ] Check user's plan before automation
  - [ ] Enforce daily limits based on plan
  - [ ] Show upgrade prompts when limits reached
- [ ] Test full subscription flow
  - [ ] Sign up (free)
  - [ ] Upgrade to Pro
  - [ ] Manage subscription
  - [ ] Downgrade to Free
  - [ ] Cancel subscription

---

### Week 15-16: Advanced Features (Paid Tiers)

#### AI Cover Letters (Pro+)

- [ ] Choose AI provider (OpenAI GPT-4 or Anthropic Claude)
- [ ] Set up API account and keys
- [ ] Create cover letter generation prompt
- [ ] Implement `generateCoverLetter()` function
  - [ ] Input: Job description, user resume, user background
  - [ ] Output: Customized cover letter
  - [ ] Retry on failure
  - [ ] Cache results
- [ ] Create API endpoint `POST /api/cover-letter/generate`
- [ ] Create UI for cover letter generation
  - [ ] Toggle in settings (enable/disable)
  - [ ] Preview generated letters
  - [ ] Regenerate option
  - [ ] Edit before sending
  - [ ] Template customization (tone, length)
- [ ] Integrate into automation
  - [ ] Generate cover letter for each application
  - [ ] Attach to application
  - [ ] Store generated letters in database
- [ ] Monitor API costs and usage
- [ ] Implement rate limiting for AI generation

#### Multiple Resumes (Premium)

- [ ] Update database schema
  - [ ] Add `resumes` table (multiple per user)
  - [ ] resume_name, resume_url, is_default, created_at
- [ ] Create resume management UI
  - [ ] List all resumes
  - [ ] Upload new resume
  - [ ] Set default resume
  - [ ] Delete resume
  - [ ] Assign resume to job types (future)
- [ ] Update automation to use default resume
- [ ] Allow manual resume selection per application (future)

#### Advanced Filters (Pro+)

- [ ] Add company size filter
- [ ] Add industry filter
- [ ] Add experience level filter
- [ ] Add job posting age filter (e.g., last 24 hours)
- [ ] Add company rating filter (Glassdoor integration)
- [ ] Update preferences form with new filters
- [ ] Update automation logic to apply filters

#### Custom Scheduling (Pro+)

- [ ] Allow multiple schedules (e.g., weekdays vs. weekends)
- [ ] Allow different limits per schedule
- [ ] Pause on specific dates (vacation mode)
- [ ] Create advanced scheduling UI
- [ ] Test complex schedules

---

### Week 17-18: Multi-Platform Support

#### LinkedIn Integration

- [ ] Research LinkedIn Easy Apply flow
- [ ] Implement LinkedIn login automation
- [ ] Implement LinkedIn job search
- [ ] Implement LinkedIn Easy Apply submission
- [ ] Test thoroughly with test account
- [ ] Handle LinkedIn-specific edge cases
- [ ] Add LinkedIn credentials form
- [ ] Update automation to support LinkedIn

#### ZipRecruiter Integration (Future)

- [ ] Similar steps as LinkedIn
- [ ] Document for future implementation

#### Platform Management UI

- [ ] Create platform management page
  - [ ] Cards for each platform (logo, status, connect button)
  - [ ] Toggle to enable/disable platforms
  - [ ] Platform-specific settings
- [ ] Update dashboard to show platform breakdown
- [ ] Update filters to include platform selector

---

### Week 19-20: Marketing & Launch Preparation

#### Landing Page

- [ ] Create marketing landing page (`/`)
  - [ ] Hero section with clear value proposition
  - [ ] How it works (3-step visual)
  - [ ] Features showcase
  - [ ] Testimonials from pilot users
  - [ ] Pricing section
  - [ ] FAQ
  - [ ] CTA (Get Started Free)
- [ ] Add demo video
  - [ ] Screen recording of full flow
  - [ ] Voiceover or captions
  - [ ] Upload to YouTube
  - [ ] Embed on landing page
- [ ] SEO optimization
  - [ ] Meta titles and descriptions
  - [ ] Open Graph tags
  - [ ] Twitter cards
  - [ ] Schema markup
  - [ ] Sitemap
  - [ ] robots.txt
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Lazy loading
  - [ ] Code splitting
  - [ ] CDN for assets

#### Content Creation

- [ ] Write blog post: "Why I Built Job Pilot"
- [ ] Write blog post: "How to Automate Your Job Search"
- [ ] Write blog post: "Job Application Stats Analysis"
- [ ] Create tutorial videos
  - [ ] Getting started
  - [ ] Setting preferences
  - [ ] Using the dashboard
- [ ] Create social media assets
  - [ ] Screenshots
  - [ ] Graphics
  - [ ] Short demo clips

#### Product Hunt Preparation

- [ ] Create Product Hunt account
- [ ] Plan launch date (Tuesday-Thursday recommended)
- [ ] Prepare Product Hunt assets
  - [ ] Logo and screenshots
  - [ ] Tagline
  - [ ] Description
  - [ ] First comment (from maker)
  - [ ] Gallery images
- [ ] Line up hunter (if possible)
- [ ] Notify pilot users to support launch
- [ ] Prepare to respond to comments all day

---

### Week 21: Launch & Growth

#### Public Launch

- [ ] Deploy final version to production
- [ ] Launch on Product Hunt
- [ ] Post on Reddit (r/jobs, r/cscareerquestions, r/jobsearchhacks)
- [ ] Post on Hacker News
- [ ] Share on Twitter/LinkedIn
- [ ] Email pilot users with launch announcement
- [ ] Monitor closely for issues
- [ ] Respond to all comments and questions
- [ ] Fix critical bugs immediately

#### Post-Launch

- [ ] Collect feedback from new users
- [ ] Monitor key metrics daily
  - [ ] Signups
  - [ ] Activations
  - [ ] Conversions
  - [ ] Churn
  - [ ] Revenue
- [ ] Weekly iteration based on feedback
- [ ] Continue content marketing
- [ ] Experiment with paid ads (if budget allows)
- [ ] Build email nurture sequence for free users
- [ ] Create case studies from successful users

---

## Ongoing: Maintenance & Growth

### Monthly Tasks

- [ ] Review metrics and KPIs
- [ ] User feedback analysis
- [ ] Bug fixes and maintenance
- [ ] Security updates
- [ ] Performance optimization
- [ ] Content creation (blog posts, videos)
- [ ] Feature prioritization
- [ ] Customer interviews

### Quarterly Goals

- [ ] Add new job platform
- [ ] Launch new major feature
- [ ] Expand to new user segment
- [ ] Revenue milestone ($5k → $10k → $20k MRR)

### Long-Term Vision

- [ ] Mobile app (React Native)
- [ ] Interview scheduling automation
- [ ] Application tracking integrations (ATS)
- [ ] Team/agency plans
- [ ] White-label solution
- [ ] International expansion
- [ ] Exit strategy (acquisition or IPO)

---

## Notes & Decisions

### Open Questions

- What's the optimal daily limit for free tier? (5 vs. 10)
- Should we require email confirmation on signup?
- Should we build admin dashboard in Phase 1 or Phase 2?
- How do we handle CAPTCHA on job boards? (Manual fallback?)
- Should we support custom cover letter templates in Phase 1?

### Risks to Monitor

- Job board UI changes
- Account bans
- Scalability issues
- Legal/compliance concerns
- Competition

### Success Criteria (End of Phase 1)

- [ ] 5+ test users successfully using the product
- [ ] 80%+ application success rate
- [ ] < 5 critical bugs
- [ ] Complete user flow functional (signup → apply → dashboard)
- [ ] Positive feedback from test users

---

**Legend:**

- [ ] Not started
- [x] Completed
- [~] In progress
- [!] Blocked

**Priority Levels:**

- P0: Must have (blocks launch)
- P1: Should have (important but not blocking)
- P2: Nice to have (can be deferred)
- P3: Future consideration

---

**Document Maintenance:**
This TODO list should be updated weekly. Mark tasks as completed, add new tasks as they arise, and adjust priorities based on feedback and learnings.
