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

- [ ] Create Supabase account and project (Optional: Can use local instance with Docker)
- [x] Install Supabase CLI (Completed: 2025-12-28)
- [x] Initialize local Supabase instance (Completed: 2025-12-28)
- [x] Configure Supabase client in Next.js (Completed: 2025-12-28)
- [x] Set up environment variables (Completed: 2025-12-28)
  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [x] `SUPABASE_SERVICE_ROLE_KEY`

#### Database Schema

- [x] Create `users` table (handled by Supabase Auth) (Completed: 2025-12-28)
- [x] Create `profiles` table (Completed: 2025-12-28)
  - [x] id (uuid, primary key)
  - [x] email (text)
  - [x] full_name (text)
  - [x] phone (text)
  - [x] location (text)
  - [x] linkedin_url (text)
  - [x] portfolio_url (text)
  - [x] current_title (text)
  - [x] years_of_experience (integer)
  - [x] resume_url (text)
  - [x] created_at, updated_at (timestamps)
- [x] Create `job_preferences` table (Completed: 2025-12-28)
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key)
  - [x] desired_titles (text[])
  - [x] desired_locations (text[])
  - [x] remote_only (boolean)
  - [x] hybrid_ok (boolean)
  - [x] min_salary (integer)
  - [x] max_salary (integer)
  - [x] employment_types (text[])
  - [x] experience_levels (text[])
  - [x] industries (text[])
  - [x] company_sizes (text[])
  - [x] keywords (text[])
  - [x] excluded_keywords (text[])
  - [x] excluded_companies (text[])
  - [x] created_at, updated_at (timestamps)
- [x] Create `job_board_credentials` table (Completed: 2025-12-28)
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key)
  - [x] platform (enum: indeed, linkedin, glassdoor, ziprecruiter, monster, dice)
  - [x] encrypted_username (text)
  - [x] encrypted_password (text)
  - [x] additional_data (jsonb)
  - [x] is_verified (boolean)
  - [x] last_verified_at (timestamp)
  - [x] created_at, updated_at (timestamps)
- [x] Create `applications` table (Completed: 2025-12-28)
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key)
  - [x] job_title (text)
  - [x] company_name (text)
  - [x] company_url (text)
  - [x] job_url (text)
  - [x] location (text)
  - [x] remote_type (enum: remote, hybrid, onsite)
  - [x] salary_range (text)
  - [x] job_description (text)
  - [x] platform (enum: indeed, linkedin, glassdoor, ziprecruiter, monster, dice, manual)
  - [x] status (enum: pending, applied, screening, interviewing, offer, rejected, withdrawn, expired)
  - [x] applied_at (timestamp)
  - [x] is_automated (boolean)
  - [x] automation_run_id (uuid, foreign key)
  - [x] resume_version (text)
  - [x] cover_letter_version (text)
  - [x] last_status_update (timestamp)
  - [x] response_received (boolean)
  - [x] notes (text)
  - [x] created_at, updated_at (timestamps)
- [x] Create `automation_runs` table (Completed: 2025-12-28)
  - [x] id (uuid, primary key)
  - [x] user_id (uuid, foreign key)
  - [x] status (enum: running, completed, failed, cancelled)
  - [x] started_at (timestamp)
  - [x] completed_at (timestamp)
  - [x] jobs_found (integer)
  - [x] applications_submitted (integer)
  - [x] applications_failed (integer)
  - [x] preferences_snapshot (jsonb)
  - [x] platforms_used (text[])
  - [x] error_message (text)
  - [x] error_details (jsonb)
  - [x] created_at, updated_at (timestamps)
- [x] Set up Row Level Security (RLS) policies (Completed: 2025-12-28)
- [x] Create database indexes for performance (Completed: 2025-12-28)
- [x] Write migration scripts (Completed: 2025-12-28)
- [x] Create triggers for automatic updated_at timestamps (Completed: 2025-12-28)
- [x] Create trigger for auto-profile creation on signup (Completed: 2025-12-28)

#### Storage Setup

- [x] Configure Supabase Storage bucket for resumes (Completed: 2025-12-28)
- [x] Configure Supabase Storage bucket for cover letters (Completed: 2025-12-28)
- [x] Set up storage policies (user can only access their own files) (Completed: 2025-12-28)
- [x] Create storage helper functions (uploadFile, deleteFile, getFileUrl, listUserFiles, downloadFile, validateFile) (Completed: 2025-12-28)
- [x] Create test page for storage functionality (Completed: 2025-12-28)

---

### Week 2: Authentication & User Profile

#### Authentication Pages

- [x] Create `/app/auth/signup` page (Completed: 2025-12-28)
  - [x] Email input with validation
  - [x] Password input with strength indicator
  - [x] Confirm password field
  - [x] Terms of service checkbox
  - [x] Sign up button with loading state
  - [x] Error handling and display
  - [x] Redirect to dashboard after signup
- [x] Create `/app/auth/login` page (Completed: 2025-12-28)
  - [x] Email input
  - [x] Password input
  - [x] "Remember me" option
  - [x] Login button with loading state
  - [x] "Forgot password?" link (placeholder)
  - [x] Redirect to dashboard after login
- [ ] Create `/app/auth/forgot-password` page
  - [ ] Email input
  - [ ] Send reset link button
  - [ ] Success message
  - [ ] Handle reset token from email
- [x] Create auth server actions (Completed: 2025-12-28)
  - [x] `signUp(formData)`
  - [x] `signIn(formData)`
  - [x] `signOut()`
  - [x] `getCurrentUser()`

#### Session Management

- [x] Implement session persistence (Completed: 2025-12-28)
- [x] Implement automatic token refresh (handled by middleware) (Completed: 2025-12-28)
- [x] Create protected route middleware (Completed: 2025-12-28)
- [x] Redirect unauthenticated users to login (Completed: 2025-12-28)
- [x] Redirect authenticated users away from auth pages (Completed: 2025-12-28)

#### Dashboard

- [x] Create basic dashboard page (Completed: 2025-12-28)
  - [x] Navigation bar with user email
  - [x] Sign out button
  - [x] Quick stats cards (placeholders)
  - [x] Getting started guide

#### Profile Management

- [x] Create `ProfileForm` component (Completed: 2025-12-28)
  - [x] Full name input
  - [x] Phone number input
  - [x] Email display (read-only)
  - [x] Location input
  - [x] Current title input
  - [x] Years of experience input
  - [x] LinkedIn URL input
  - [x] Portfolio URL input
  - [x] Resume display section
  - [x] Save button
  - [x] Loading and error states
  - [x] Success message display
- [x] Create profile server actions (Completed: 2025-12-28)
  - [x] `getProfile()` - Fetch user profile
  - [x] `updateProfile(formData)` - Update user profile
  - [x] `updateResumeUrl(url)` - Update resume URL
- [x] Implement profile creation on signup (trigger in migration) (Completed: 2025-12-28)
- [x] Create profile page with navigation (Completed: 2025-12-28)
- [x] Add profile link to dashboard (Completed: 2025-12-28)
- [x] Add profile route protection in middleware (Completed: 2025-12-28)

---

### Week 3: Resume Upload & Job Preferences

#### Resume & Cover Letter Upload

- [x] Create `ResumeUpload` component (Completed: 2025-12-28)
  - [x] File picker button
  - [x] File type validation (PDF, DOC, DOCX)
  - [x] File size validation (max 5MB)
  - [x] Upload progress feedback
  - [x] Preview uploaded file
  - [x] Delete file button with confirmation
  - [x] View/download file button
- [x] Implement resume upload functionality (Completed: 2025-12-28)
  - [x] Uses existing storage helpers (uploadFile, deleteFile)
  - [x] Updates profile.resume_url via server action
  - [x] Integrated into profile page
- [x] Implement file validation (client-side) (Completed: 2025-12-28)
- [x] Handle upload errors gracefully (Completed: 2025-12-28)
- [x] Create cover letter upload component (Completed: 2025-12-28)
  - [x] Added cover_letter_url column to profiles table
  - [x] Created CoverLetterUpload component (reuses uploadFile, deleteFile, validateFile)
  - [x] Added updateCoverLetterUrl server action
  - [x] Integrated into ProfileForm with description
  - [x] Uses cover-letters storage bucket
- [ ] Implement drag-and-drop zone enhancement

#### Job Preferences Form

- [x] Create `JobPreferencesForm` component (Completed: 2025-12-28)
  - [x] Job titles input (comma-separated)
  - [x] Locations input (comma-separated)
  - [x] Keywords to include (comma-separated)
  - [x] Keywords to exclude (comma-separated)
  - [x] Remote only checkbox
  - [x] Hybrid ok checkbox
  - [x] Employment types input (comma-separated)
  - [x] Experience levels input (comma-separated)
  - [x] Industries input (comma-separated)
  - [x] Company sizes input (comma-separated)
  - [x] Minimum salary input (number, optional)
  - [x] Maximum salary input (number, optional)
  - [x] Excluded companies input (comma-separated)
  - [x] Save button with loading state
  - [x] Cancel button
  - [x] Form validation and error handling
  - [x] Success message display
- [x] Create preferences server actions (Completed: 2025-12-28)
  - [x] `getJobPreferences()` - Fetch preferences with defaults
  - [x] `saveJobPreferences(formData)` - Upsert preferences
- [x] Create preferences page (Completed: 2025-12-28)
  - [x] Auth protection via middleware
  - [x] Navigation with links to dashboard and profile
  - [x] Error handling for failed preference loading
- [x] Add preferences link to dashboard (Completed: 2025-12-28)
- [x] Implement validation logic (Completed: 2025-12-28)
  - [x] Parse comma-separated arrays
  - [x] Trim whitespace from inputs
  - [x] Filter empty values
  - [x] Handle checkboxes correctly
- [x] Add helpful placeholders (Completed: 2025-12-28)

#### Job Board Credentials

- [x] Create `CredentialsForm` component (Completed: 2025-12-28)
  - [x] Platform selector (Indeed supported, others coming soon)
  - [x] Username/email input
  - [x] Password input with show/hide toggle
  - [x] Save credentials button with loading state
  - [x] Success/error messages
  - [x] Security disclaimer text with encryption details
- [x] Create credentials server actions (Completed: 2025-12-28)
  - [x] `saveCredentials(formData)` - Save/update credentials (encrypted)
  - [x] `getCredentials()` - List connected platforms with decrypted usernames
  - [x] `deleteCredentials(credentialId)` - Remove credentials
- [x] Implement encryption for credentials (Completed: 2025-12-28)
  - [x] Created encryption helpers using Web Crypto API (AES-256-GCM)
  - [x] Encryption key stored in environment variable (ENCRYPTION_KEY)
  - [x] Passwords encrypted before storage, never logged or exposed
  - [x] Usernames also encrypted for additional security
- [x] Create CredentialsList component (Completed: 2025-12-28)
  - [x] Display saved credentials with platform and username
  - [x] Show verification status (if verified)
  - [x] Delete button with confirmation
- [x] Create credentials page (Completed: 2025-12-28)
  - [x] Auth protection via middleware
  - [x] Navigation with links to dashboard, profile, preferences
  - [x] Integrated CredentialsForm and CredentialsList
- [x] Add credentials link to dashboard (Completed: 2025-12-28)
- [x] Implement credential testing (Completed: 2025-12-28)
  - [x] Installed Playwright and Chromium browser
  - [x] Created indeed-tester module with testIndeedCredentials function
  - [x] Lightweight login check using headless browser
  - [x] Error handling for timeouts, invalid credentials, connection issues
- [x] Add "Test Connection" button to verify credentials (Completed: 2025-12-28)
  - [x] Button in CredentialsForm
  - [x] Success/error feedback
  - [x] Credentials marked as verified with timestamp

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
