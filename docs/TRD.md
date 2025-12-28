# Technical Requirements Document (TRD)
# Job Pilot - Automated Job Application Platform

**Version:** 1.0
**Last Updated:** 2025-12-28
**Status:** Phase 1 - Local Development

---

## 1. Executive Summary

Job Pilot is an automated job application service that applies to jobs on behalf of users. This document outlines the technical requirements for the three-phase development approach: local development, pilot deployment, and commercialization.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────┐
│   Next.js Web   │
│   Application   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
┌────────▼────────┐              ┌────────▼────────┐
│   Supabase      │              │   Playwright    │
│   - Auth        │              │   Automation    │
│   - Postgres    │              │   Engine        │
│   - Storage     │              │                 │
└─────────────────┘              └────────┬────────┘
                                          │
                                          ▼
                                 ┌─────────────────┐
                                 │   Job Boards    │
                                 │   (Indeed, etc) │
                                 └─────────────────┘
```

### 2.2 Technology Stack

#### Phase 1: Local Development
- **Frontend Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (local)
  - PostgreSQL 15+
  - Auth (email/password)
  - Storage (resume/cover letter files)
- **Automation:** Playwright (Node.js)
- **Package Manager:** npm/pnpm

#### Phase 2: Pilot Deployment
- **Frontend Hosting:** Vercel
- **Backend:** Supabase Cloud
- **Automation Hosting:** Railway or Render
- **Monitoring:** Sentry
- **Email:** Resend or SendGrid
- **Logging:** Managed logging (Railway/Render built-in)

#### Phase 3: Commercialization
- **Payments:** Stripe (Subscriptions, Checkout, Billing Portal)
- **Analytics:** Vercel Analytics + custom event tracking
- **Support:** Intercom or plain.com
- **CDN:** Vercel Edge Network

---

## 3. Functional Requirements

### 3.1 Phase 1 Requirements

#### 3.1.1 User Authentication
- **REQ-AUTH-001:** Users must be able to sign up with email and password
- **REQ-AUTH-002:** Users must be able to log in with email and password
- **REQ-AUTH-003:** Users must be able to log out
- **REQ-AUTH-004:** Password reset via email must be supported
- **REQ-AUTH-005:** Session management with automatic token refresh

#### 3.1.2 User Profile & Document Management
- **REQ-PROFILE-001:** Users must be able to upload a resume (PDF, DOCX, max 5MB)
- **REQ-PROFILE-002:** Users must be able to upload an optional cover letter (PDF, DOCX, max 5MB)
- **REQ-PROFILE-003:** Users must be able to view and download their uploaded documents
- **REQ-PROFILE-004:** Users must be able to replace uploaded documents
- **REQ-PROFILE-005:** Users must be able to set basic profile information (name, email, phone)

#### 3.1.3 Job Preferences
- **REQ-PREF-001:** Users must be able to specify job titles (multiple, comma-separated)
- **REQ-PREF-002:** Users must be able to specify locations (multiple, comma-separated)
- **REQ-PREF-003:** Users must be able to specify keywords to include
- **REQ-PREF-004:** Users must be able to specify keywords to exclude
- **REQ-PREF-005:** Users must be able to set remote preference (remote only, hybrid, on-site, any)
- **REQ-PREF-006:** Users must be able to set employment type (full-time, part-time, contract, any)
- **REQ-PREF-007:** Users must be able to set salary expectations (min/max)
- **REQ-PREF-008:** Users must be able to save and update preferences
- **REQ-PREF-009:** Users must be able to provide job board credentials (encrypted storage)

#### 3.1.4 Automation Engine
- **REQ-AUTO-001:** System must support Indeed Easy Apply as first platform
- **REQ-AUTO-002:** Automation must be manually triggered by user
- **REQ-AUTO-003:** System must search for jobs matching user preferences
- **REQ-AUTO-004:** System must filter out jobs requiring complex manual steps
- **REQ-AUTO-005:** System must submit applications using stored resume
- **REQ-AUTO-006:** System must record each application attempt in database
- **REQ-AUTO-007:** System must handle authentication with user credentials
- **REQ-AUTO-008:** System must detect and skip already-applied jobs
- **REQ-AUTO-009:** System must provide real-time progress feedback during execution
- **REQ-AUTO-010:** System must gracefully handle failures and continue processing

#### 3.1.5 Application Tracking
- **REQ-TRACK-001:** System must record job title for each application
- **REQ-TRACK-002:** System must record company name for each application
- **REQ-TRACK-003:** System must record application date/time
- **REQ-TRACK-004:** System must record application status (pending, submitted, failed)
- **REQ-TRACK-005:** System must record job board source
- **REQ-TRACK-006:** System must record job listing URL
- **REQ-TRACK-007:** System must record failure reason when applicable
- **REQ-TRACK-008:** System must support manual status updates by user

#### 3.1.6 Dashboard
- **REQ-DASH-001:** Users must see list of all applications
- **REQ-DASH-002:** Users must see application statistics (total, successful, failed)
- **REQ-DASH-003:** Users must be able to filter applications by status
- **REQ-DASH-004:** Users must be able to filter applications by date range
- **REQ-DASH-005:** Users must be able to search applications by company or title
- **REQ-DASH-006:** Users must be able to click through to original job listing
- **REQ-DASH-007:** Users must be able to manually trigger automation
- **REQ-DASH-008:** Users must be able to pause/resume automation
- **REQ-DASH-009:** Users must see when automation last ran

### 3.2 Phase 2 Requirements

#### 3.2.1 Deployment & Infrastructure
- **REQ-DEPLOY-001:** Frontend must be deployed to Vercel with automatic deployments
- **REQ-DEPLOY-002:** Supabase must be migrated to cloud project
- **REQ-DEPLOY-003:** Automation engine must be deployed to Railway or Render
- **REQ-DEPLOY-004:** Automation must support HTTP-triggered execution
- **REQ-DEPLOY-005:** Automation must support scheduled execution (daily)
- **REQ-DEPLOY-006:** System must have staging and production environments

#### 3.2.2 Reliability & Monitoring
- **REQ-MONITOR-001:** All errors must be logged to Sentry
- **REQ-MONITOR-002:** Failed applications must be retried automatically (max 3 attempts)
- **REQ-MONITOR-003:** System must have health check endpoints
- **REQ-MONITOR-004:** Database queries must be monitored for performance
- **REQ-MONITOR-005:** Automation runs must be logged with full context

#### 3.2.3 Notifications
- **REQ-NOTIF-001:** Users must receive daily email summaries of applications
- **REQ-NOTIF-002:** Users must receive weekly email summaries
- **REQ-NOTIF-003:** Users must be notified when automation fails
- **REQ-NOTIF-004:** Users must be able to configure notification preferences
- **REQ-NOTIF-005:** Email templates must be professional and branded

#### 3.2.4 Quality & Guardrails
- **REQ-QUALITY-001:** System must limit daily applications per user (default: 10)
- **REQ-QUALITY-002:** System must skip jobs with salary below user minimum
- **REQ-QUALITY-003:** System must skip jobs with low match score (TBD criteria)
- **REQ-QUALITY-004:** Users must be able to configure daily application limit
- **REQ-QUALITY-005:** System must provide application preview before bulk submit

#### 3.2.5 User Feedback
- **REQ-FEEDBACK-001:** Users must be able to submit feedback via in-app form
- **REQ-FEEDBACK-002:** Users must be able to report failed applications
- **REQ-FEEDBACK-003:** System must track user satisfaction metrics
- **REQ-FEEDBACK-004:** Admin must be able to view all feedback

### 3.3 Phase 3 Requirements

#### 3.3.1 Payments & Subscriptions
- **REQ-PAY-001:** System must support Stripe Checkout integration
- **REQ-PAY-002:** System must support monthly and annual subscriptions
- **REQ-PAY-003:** Free tier: max 5 applications per day
- **REQ-PAY-004:** Paid tier: max 50 applications per day
- **REQ-PAY-005:** Users must access Stripe Billing Portal for subscription management
- **REQ-PAY-006:** System must handle webhook events (subscription created, updated, cancelled)
- **REQ-PAY-007:** System must enforce tier limits
- **REQ-PAY-008:** System must handle failed payments gracefully

#### 3.3.2 Advanced Features
- **REQ-ADVANCED-001:** Paid users must access AI-generated cover letters
- **REQ-ADVANCED-002:** Paid users must access advanced filters
- **REQ-ADVANCED-003:** Paid users must access custom scheduling
- **REQ-ADVANCED-004:** System must support multiple resumes per user
- **REQ-ADVANCED-005:** System must support resume tailoring per application

#### 3.3.3 Marketing & Growth
- **REQ-MARKETING-001:** Landing page must clearly explain value proposition
- **REQ-MARKETING-002:** Landing page must include demo video
- **REQ-MARKETING-003:** Landing page must include pricing comparison
- **REQ-MARKETING-004:** System must track conversion funnel metrics
- **REQ-MARKETING-005:** System must support referral tracking

#### 3.3.4 Support
- **REQ-SUPPORT-001:** Users must access help documentation
- **REQ-SUPPORT-002:** Users must access chat support
- **REQ-SUPPORT-003:** System must have comprehensive FAQ
- **REQ-SUPPORT-004:** System must track support tickets

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **REQ-PERF-001:** Dashboard must load in < 2 seconds
- **REQ-PERF-002:** Automation must process at least 10 applications per hour
- **REQ-PERF-003:** Database queries must execute in < 500ms (p95)
- **REQ-PERF-004:** File uploads must support files up to 5MB
- **REQ-PERF-005:** System must support 100 concurrent users (Phase 2)
- **REQ-PERF-006:** System must support 1000 concurrent users (Phase 3)

### 4.2 Security
- **REQ-SEC-001:** All passwords must be hashed using bcrypt
- **REQ-SEC-002:** Job board credentials must be encrypted at rest
- **REQ-SEC-003:** All API endpoints must require authentication
- **REQ-SEC-004:** HTTPS must be enforced for all connections
- **REQ-SEC-005:** File uploads must be scanned for malware
- **REQ-SEC-006:** Rate limiting must be implemented on all endpoints
- **REQ-SEC-007:** CORS must be properly configured
- **REQ-SEC-008:** SQL injection prevention via parameterized queries
- **REQ-SEC-009:** XSS prevention via input sanitization

### 4.3 Reliability
- **REQ-REL-001:** System uptime must be > 99% (Phase 2+)
- **REQ-REL-002:** Database must have automated backups (daily)
- **REQ-REL-003:** System must gracefully handle job board downtime
- **REQ-REL-004:** System must recover from crashes automatically
- **REQ-REL-005:** Data must not be lost during failures

### 4.4 Scalability
- **REQ-SCALE-001:** Database must support horizontal scaling (Phase 3)
- **REQ-SCALE-002:** Automation workers must be horizontally scalable
- **REQ-SCALE-003:** File storage must support CDN distribution
- **REQ-SCALE-004:** System must handle 10,000+ users (Phase 3)

### 4.5 Maintainability
- **REQ-MAINT-001:** Code must be TypeScript with strict mode
- **REQ-MAINT-002:** Code coverage must be > 60% (Phase 2+)
- **REQ-MAINT-003:** All public functions must have JSDoc comments
- **REQ-MAINT-004:** Database migrations must be versioned and reversible
- **REQ-MAINT-005:** Environment configuration must be externalized

### 4.6 Usability
- **REQ-UX-001:** Onboarding must be completable in < 5 minutes
- **REQ-UX-002:** UI must be responsive (mobile, tablet, desktop)
- **REQ-UX-003:** Error messages must be user-friendly
- **REQ-UX-004:** Loading states must be clearly indicated
- **REQ-UX-005:** System must support light and dark modes (Phase 2+)

---

## 5. Data Requirements

### 5.1 Database Schema (Phase 1)

#### 5.1.1 Users Table
```sql
users (
  id: uuid (primary key)
  email: string (unique, not null)
  created_at: timestamp
  updated_at: timestamp
)
```

#### 5.1.2 Profiles Table
```sql
profiles (
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  full_name: string
  phone: string
  resume_url: string
  cover_letter_url: string
  created_at: timestamp
  updated_at: timestamp
)
```

#### 5.1.3 Job Preferences Table
```sql
job_preferences (
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  job_titles: string[] (array)
  locations: string[] (array)
  keywords_include: string[] (array)
  keywords_exclude: string[] (array)
  remote_preference: enum (remote_only, hybrid, onsite, any)
  employment_type: enum (full_time, part_time, contract, any)
  min_salary: integer (nullable)
  max_salary: integer (nullable)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
)
```

#### 5.1.4 Job Board Credentials Table
```sql
job_board_credentials (
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  platform: enum (indeed, linkedin, etc)
  username: string (encrypted)
  password: string (encrypted)
  created_at: timestamp
  updated_at: timestamp
)
```

#### 5.1.5 Applications Table
```sql
applications (
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  job_title: string (not null)
  company_name: string (not null)
  job_board: enum (indeed, linkedin, etc)
  job_url: string (not null)
  location: string
  salary_range: string (nullable)
  status: enum (pending, submitted, failed, interview, rejected, offer)
  failure_reason: text (nullable)
  applied_at: timestamp
  created_at: timestamp
  updated_at: timestamp
)
```

#### 5.1.6 Automation Runs Table
```sql
automation_runs (
  id: uuid (primary key)
  user_id: uuid (foreign key -> users.id)
  status: enum (running, completed, failed)
  jobs_found: integer
  applications_submitted: integer
  applications_failed: integer
  error_message: text (nullable)
  started_at: timestamp
  completed_at: timestamp (nullable)
)
```

### 5.2 File Storage Structure
```
/users/{user_id}/
  /resumes/
    resume-{timestamp}.pdf
  /cover-letters/
    cover-letter-{timestamp}.pdf
```

---

## 6. API Requirements

### 6.1 Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End user session
- `POST /api/auth/reset-password` - Send password reset email
- `POST /api/auth/update-password` - Update user password

### 6.2 Profile Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/resume` - Upload resume
- `POST /api/profile/cover-letter` - Upload cover letter
- `DELETE /api/profile/resume` - Delete resume
- `DELETE /api/profile/cover-letter` - Delete cover letter

### 6.3 Preferences Endpoints
- `GET /api/preferences` - Get job preferences
- `PUT /api/preferences` - Update job preferences
- `POST /api/credentials` - Store job board credentials
- `GET /api/credentials` - List configured platforms

### 6.4 Applications Endpoints
- `GET /api/applications` - List all applications (with filters)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id` - Update application status
- `GET /api/applications/stats` - Get application statistics

### 6.5 Automation Endpoints
- `POST /api/automation/run` - Trigger automation manually
- `POST /api/automation/pause` - Pause automation
- `POST /api/automation/resume` - Resume automation
- `GET /api/automation/status` - Get current automation status
- `GET /api/automation/history` - Get automation run history

### 6.6 Phase 2+ Endpoints
- `POST /api/webhooks/stripe` - Handle Stripe webhooks (Phase 3)
- `GET /api/billing/portal` - Get Stripe portal URL (Phase 3)
- `POST /api/feedback` - Submit user feedback (Phase 2)
- `POST /api/notifications/preferences` - Update notification settings (Phase 2)

---

## 7. Integration Requirements

### 7.1 Job Board Integration (Phase 1: Indeed)
- **REQ-INT-001:** Support Indeed login automation
- **REQ-INT-002:** Support Indeed Easy Apply flow
- **REQ-INT-003:** Parse job listing details (title, company, location, salary)
- **REQ-INT-004:** Detect already-applied jobs
- **REQ-INT-005:** Handle CAPTCHA detection (fail gracefully)
- **REQ-INT-006:** Handle session expiration
- **REQ-INT-007:** Support job search with filters

### 7.2 Future Job Board Integrations (Phase 3)
- LinkedIn Easy Apply
- ZipRecruiter
- Glassdoor
- Remote.co
- AngelList/Wellfound

---

## 8. Testing Requirements

### 8.1 Unit Testing
- All utility functions must have unit tests
- All API route handlers must have unit tests
- Target coverage: 60%+ (Phase 2+)

### 8.2 Integration Testing
- Auth flow must have end-to-end tests
- File upload flow must have integration tests
- Automation engine must have integration tests with mock job board

### 8.3 End-to-End Testing
- Complete user journey (signup → preferences → run automation → view dashboard)
- Payment flow (Phase 3)
- Onboarding flow (Phase 2+)

### 8.4 Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness testing
- Real job board testing with test accounts
- Pilot user testing (Phase 2)

---

## 9. Deployment Requirements

### 9.1 Phase 1: Local Development
- Local Supabase instance via Docker or Supabase CLI
- Next.js dev server
- Playwright automation runs locally
- Environment variables in `.env.local`

### 9.2 Phase 2: Pilot Deployment
- Vercel deployment with preview environments
- Supabase cloud (paid plan for production features)
- Railway or Render for automation service
- Environment variables managed via platform dashboards
- Automated deployments on git push
- Staging environment for testing

### 9.3 Phase 3: Production
- Production environment with monitoring
- Database connection pooling
- CDN for static assets
- Edge functions for performance-critical operations
- Automated backups and disaster recovery

---

## 10. Operational Requirements

### 10.1 Monitoring & Alerting
- Error tracking via Sentry
- Uptime monitoring
- Database performance monitoring
- Automation success rate tracking
- User engagement metrics

### 10.2 Logging
- Structured logging for all services
- Log retention: 30 days (development), 90 days (production)
- Searchable logs via platform tooling

### 10.3 Backup & Recovery
- Daily database backups
- Point-in-time recovery capability
- File storage redundancy
- Tested disaster recovery procedures (Phase 3)

---

## 11. Compliance & Legal

### 11.1 Data Privacy
- GDPR compliance for EU users (Phase 3)
- Clear privacy policy
- Data deletion capability
- User data export capability
- Cookie consent (Phase 2+)

### 11.2 Terms of Service
- Clear terms regarding automation usage
- Job board terms compliance disclaimer
- Liability limitations
- User responsibilities

### 11.3 Job Board Compliance
- Respect robots.txt
- Implement rate limiting
- Use user's own credentials
- Comply with platform terms (gray area - document risks)

---

## 12. Dependencies

### 12.1 Critical Dependencies
- Next.js 14+
- React 18+
- Supabase JS Client
- Playwright
- TypeScript 5+
- Tailwind CSS 3+

### 12.2 Phase 2 Dependencies
- Sentry SDK
- Email service SDK (Resend/SendGrid)
- Stripe SDK (Phase 3)

### 12.3 Development Dependencies
- ESLint
- Prettier
- Husky (git hooks)
- Jest or Vitest
- React Testing Library
- Playwright Test

---

## 13. Constraints & Assumptions

### 13.1 Constraints
- Budget: Minimal cloud costs during Phase 1-2
- Team size: Solo founder
- Development time: 4-8 weeks for Phase 1
- No mobile app (web-first approach)
- English language only (Phase 1-2)

### 13.2 Assumptions
- Users have valid job board accounts
- Users provide accurate credentials
- Job boards maintain relatively stable UI
- Users understand automation limitations
- Market exists for paid automation service

### 13.3 Risks
- Job board UI changes breaking automation
- Account bans from job boards
- Legal/compliance issues with automation
- Low user trust in automation
- Competition from established players

---

## 14. Success Metrics

### 14.1 Phase 1 Metrics
- 5+ test users successfully using the system
- 80%+ application success rate
- < 5 critical bugs
- Complete user flow functional

### 14.2 Phase 2 Metrics
- 20+ active pilot users
- 4+ star average user rating
- 50%+ of users would pay
- < 1% error rate
- 95%+ uptime

### 14.3 Phase 3 Metrics
- 100+ paying subscribers
- < 5% monthly churn
- $10k+ MRR
- 3+ supported job platforms
- 10%+ interview callback rate improvement

---

## 15. Future Considerations

### 15.1 Potential Enhancements
- Mobile app (React Native)
- AI-powered resume optimization
- Interview scheduling automation
- Application tracking API integrations
- Team/agency plans
- White-label solution
- International expansion
- Multi-language support
- Browser extension

### 15.2 Technical Debt to Address
- Migrate from manual triggers to smart scheduling
- Implement job matching algorithm
- Build admin dashboard
- Implement A/B testing framework
- Add comprehensive analytics

---

## Appendix A: Glossary

- **Easy Apply:** Simplified job application flow (1-click apply)
- **Job Board:** Platform hosting job listings (Indeed, LinkedIn, etc.)
- **Application:** A job application submission record
- **Automation Run:** A single execution of the auto-apply engine
- **Pilot User:** Beta tester during Phase 2
- **Guardrails:** Safety mechanisms to prevent low-quality applications

---

## Appendix B: References

- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs
- Playwright Documentation: https://playwright.dev
- Stripe Documentation: https://stripe.com/docs
- Vercel Documentation: https://vercel.com/docs

---

**Document Control:**
- **Author:** Job Pilot Team
- **Reviewers:** TBD
- **Approved By:** TBD
- **Next Review Date:** End of Phase 1
