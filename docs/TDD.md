# Technical Design Document (TDD)
# Job Pilot - Automated Job Application Platform

**Version:** 1.0
**Last Updated:** 2025-12-28
**Status:** Phase 1 - Local Development

---

## 1. Executive Summary

Job Pilot is a web-based SaaS platform that automates job applications on behalf of users. This document provides detailed technical designs for the system architecture, database schema, API contracts, automation engine, and deployment strategy across three development phases.

**Technology Stack:**
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage), Next.js API Routes
- **Automation:** Playwright (headless browser automation)
- **Infrastructure:** Vercel (frontend), Railway/Render (automation service), Supabase Cloud

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          Next.js Web Application (Vercel)                │   │
│  │                                                           │   │
│  │  - React Components (UI)                                 │   │
│  │  - App Router (Routing)                                  │   │
│  │  - Server Components & Actions                           │   │
│  │  - API Routes (Backend for Frontend)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               │ HTTPS
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌──────────────────┐  ┌────────────────┐  ┌────────────────────┐
│   Supabase       │  │  Automation    │  │  External APIs     │
│   (Cloud)        │  │  Service       │  │                    │
│                  │  │  (Railway/     │  │  - Stripe          │
│  - PostgreSQL    │  │   Render)      │  │  - OpenAI/Claude   │
│  - Auth          │  │                │  │  - Email (Resend)  │
│  - Storage       │  │  - Playwright  │  │  - Sentry          │
│  - Realtime      │  │  - Job Board   │  │                    │
│                  │  │    Automation  │  │                    │
└──────────────────┘  └────────┬───────┘  └────────────────────┘
                               │
                               │ HTTPS
                               ▼
                      ┌────────────────┐
                      │   Job Boards   │
                      │                │
                      │  - Indeed      │
                      │  - LinkedIn    │
                      │  - ZipRecruiter│
                      └────────────────┘
```

### 2.2 Component Architecture

#### 2.2.1 Frontend Architecture (Next.js)

```
/app
├── (auth)
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
├── (dashboard)
│   ├── layout.tsx (authenticated layout)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── applications/
│   │   ├── page.tsx (list view)
│   │   └── [id]/
│   │       └── page.tsx (detail view)
│   ├── settings/
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   ├── preferences/
│   │   │   └── page.tsx
│   │   ├── credentials/
│   │   │   └── page.tsx
│   │   ├── schedule/
│   │   │   └── page.tsx
│   │   └── billing/
│   │       └── page.tsx
│   └── help/
│       └── page.tsx
├── onboarding/
│   └── page.tsx
├── pricing/
│   └── page.tsx
├── api/ (API routes)
│   ├── auth/
│   ├── profile/
│   ├── preferences/
│   ├── applications/
│   ├── automation/
│   ├── stripe/
│   └── webhooks/
└── page.tsx (landing page)

/components
├── ui/ (shadcn/ui components)
├── auth/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── dashboard/
│   ├── StatsCards.tsx
│   └── QuickActions.tsx
├── applications/
│   ├── ApplicationsTable.tsx
│   ├── ApplicationCard.tsx
│   ├── StatusBadge.tsx
│   └── ApplicationDetail.tsx
├── automation/
│   ├── AutomationTrigger.tsx
│   ├── AutomationProgress.tsx
│   └── ScheduleSettings.tsx
├── settings/
│   ├── ProfileForm.tsx
│   ├── FileUpload.tsx
│   ├── JobPreferencesForm.tsx
│   └── CredentialsForm.tsx
└── layout/
    ├── Navbar.tsx
    ├── Sidebar.tsx
    └── Footer.tsx

/lib
├── supabase/
│   ├── client.ts (browser client)
│   └── server.ts (server client)
├── stripe/
│   └── client.ts
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   └── encryption.ts
└── hooks/
    ├── useAuth.ts
    ├── useApplications.ts
    └── useAutomation.ts

/types
├── database.ts (Supabase generated types)
├── application.ts
├── automation.ts
└── user.ts
```

#### 2.2.2 Automation Service Architecture

```
/automation-service
├── src/
│   ├── index.ts (entry point, HTTP server)
│   ├── scheduler.ts (cron jobs)
│   ├── queue/
│   │   ├── jobQueue.ts (job queue management)
│   │   └── worker.ts (queue worker)
│   ├── automation/
│   │   ├── AutomationEngine.ts (main orchestrator)
│   │   ├── platforms/
│   │   │   ├── BasePlatform.ts (abstract base class)
│   │   │   ├── IndeedAutomation.ts
│   │   │   ├── LinkedInAutomation.ts
│   │   │   └── ZipRecruiterAutomation.ts
│   │   ├── browser/
│   │   │   ├── BrowserManager.ts
│   │   │   └── SessionManager.ts
│   │   └── filters/
│   │       ├── JobFilter.ts
│   │       └── DuplicateDetector.ts
│   ├── services/
│   │   ├── SupabaseService.ts (database operations)
│   │   ├── StorageService.ts (file operations)
│   │   └── NotificationService.ts (email, etc.)
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── retry.ts
│   └── types/
│       ├── job.ts
│       ├── application.ts
│       └── config.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 3. Database Design

### 3.1 Entity-Relationship Diagram

```
┌─────────────┐
│    users    │ (Supabase Auth)
│─────────────│
│ id (PK)     │
│ email       │
│ created_at  │
└──────┬──────┘
       │
       │ 1:1
       │
┌──────▼──────────────┐
│     profiles        │
│─────────────────────│
│ id (PK)             │
│ user_id (FK) UNIQUE │
│ full_name           │
│ phone               │
│ resume_url          │
│ cover_letter_url    │
│ created_at          │
│ updated_at          │
└─────────────────────┘

       │ 1:1
       │
┌──────▼──────────────┐
│  job_preferences    │
│─────────────────────│
│ id (PK)             │
│ user_id (FK) UNIQUE │
│ job_titles          │
│ locations           │
│ keywords_include    │
│ keywords_exclude    │
│ remote_preference   │
│ employment_type     │
│ min_salary          │
│ max_salary          │
│ daily_limit         │
│ is_active           │
│ created_at          │
│ updated_at          │
└─────────────────────┘

       │ 1:N
       │
┌──────▼─────────────────┐
│ job_board_credentials  │
│────────────────────────│
│ id (PK)                │
│ user_id (FK)           │
│ platform               │
│ username (encrypted)   │
│ password (encrypted)   │
│ is_active              │
│ created_at             │
│ updated_at             │
└────────────────────────┘

       │ 1:N
       │
┌──────▼───────────────┐
│    applications      │
│──────────────────────│
│ id (PK)              │
│ user_id (FK)         │
│ automation_run_id FK │
│ job_title            │
│ company_name         │
│ job_board            │
│ job_url              │
│ location             │
│ salary_range         │
│ status               │
│ failure_reason       │
│ resume_used          │
│ cover_letter_used    │
│ applied_at           │
│ created_at           │
│ updated_at           │
└──────────────────────┘

       │ 1:N
       │
┌──────▼────────────────┐
│   automation_runs     │
│───────────────────────│
│ id (PK)               │
│ user_id (FK)          │
│ trigger_type          │
│ status                │
│ jobs_found            │
│ jobs_filtered         │
│ applications_submitted│
│ applications_failed   │
│ error_message         │
│ started_at            │
│ completed_at          │
└───────────────────────┘

       │ 1:1 (Phase 3)
       │
┌──────▼───────────────────┐
│     subscriptions        │
│──────────────────────────│
│ id (PK)                  │
│ user_id (FK) UNIQUE      │
│ stripe_customer_id       │
│ stripe_subscription_id   │
│ plan                     │
│ status                   │
│ current_period_end       │
│ cancel_at_period_end     │
│ created_at               │
│ updated_at               │
└──────────────────────────┘

       │ 1:N (Phase 2)
       │
┌──────▼────────────────┐
│   notifications       │
│───────────────────────│
│ id (PK)               │
│ user_id (FK)          │
│ type                  │
│ title                 │
│ message               │
│ link                  │
│ read                  │
│ created_at            │
└───────────────────────┘

       │ 1:N (Phase 2)
       │
┌──────▼────────────────┐
│      feedback         │
│───────────────────────│
│ id (PK)               │
│ user_id (FK)          │
│ category              │
│ message               │
│ screenshot_url        │
│ status                │
│ created_at            │
└───────────────────────┘
```

### 3.2 Table Schemas (PostgreSQL)

#### 3.2.1 profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  resume_url TEXT,
  cover_letter_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 3.2.2 job_preferences

```sql
-- Enums
CREATE TYPE remote_preference AS ENUM ('remote_only', 'hybrid', 'onsite', 'any');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'any');

CREATE TABLE job_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  job_titles TEXT[] NOT NULL DEFAULT '{}',
  locations TEXT[] NOT NULL DEFAULT '{}',
  keywords_include TEXT[] DEFAULT '{}',
  keywords_exclude TEXT[] DEFAULT '{}',
  remote_preference remote_preference DEFAULT 'any',
  employment_type employment_type DEFAULT 'full_time',
  min_salary INTEGER,
  max_salary INTEGER,
  daily_limit INTEGER DEFAULT 10 CHECK (daily_limit > 0 AND daily_limit <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_salary_range CHECK (
    (min_salary IS NULL OR max_salary IS NULL) OR (min_salary <= max_salary)
  ),
  CONSTRAINT at_least_one_job_title CHECK (array_length(job_titles, 1) > 0),
  CONSTRAINT at_least_one_location CHECK (array_length(locations, 1) > 0)
);

-- RLS Policies
ALTER TABLE job_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON job_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON job_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON job_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_job_preferences_user_id ON job_preferences(user_id);
CREATE INDEX idx_job_preferences_active ON job_preferences(is_active) WHERE is_active = TRUE;
```

#### 3.2.3 job_board_credentials

```sql
CREATE TYPE job_platform AS ENUM ('indeed', 'linkedin', 'ziprecruiter');

CREATE TABLE job_board_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform job_platform NOT NULL,
  username TEXT NOT NULL, -- Will be encrypted at application level
  password TEXT NOT NULL, -- Will be encrypted at application level
  is_active BOOLEAN DEFAULT TRUE,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Only one credential per platform per user
  UNIQUE(user_id, platform)
);

-- RLS Policies
ALTER TABLE job_board_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credentials"
  ON job_board_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own credentials"
  ON job_board_credentials FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_job_board_credentials_user_id ON job_board_credentials(user_id);
CREATE INDEX idx_job_board_credentials_platform ON job_board_credentials(platform);
```

#### 3.2.4 automation_runs

```sql
CREATE TYPE automation_status AS ENUM ('pending', 'running', 'completed', 'failed', 'paused');
CREATE TYPE trigger_type AS ENUM ('manual', 'scheduled', 'api');

CREATE TABLE automation_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trigger_type trigger_type NOT NULL,
  status automation_status DEFAULT 'pending',
  jobs_found INTEGER DEFAULT 0,
  jobs_filtered INTEGER DEFAULT 0,
  applications_submitted INTEGER DEFAULT 0,
  applications_failed INTEGER DEFAULT 0,
  error_message TEXT,
  logs JSONB DEFAULT '[]', -- Array of log entries
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  CHECK (jobs_found >= 0),
  CHECK (jobs_filtered >= 0),
  CHECK (applications_submitted >= 0),
  CHECK (applications_failed >= 0)
);

-- RLS Policies
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own automation runs"
  ON automation_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage automation runs"
  ON automation_runs FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX idx_automation_runs_user_id ON automation_runs(user_id);
CREATE INDEX idx_automation_runs_status ON automation_runs(status);
CREATE INDEX idx_automation_runs_started_at ON automation_runs(started_at DESC);
```

#### 3.2.5 applications

```sql
CREATE TYPE application_status AS ENUM (
  'pending',
  'submitted',
  'failed',
  'interview',
  'rejected',
  'offer'
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  automation_run_id UUID REFERENCES automation_runs(id) ON DELETE SET NULL,

  -- Job details
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_board job_platform NOT NULL,
  job_url TEXT NOT NULL,
  job_description TEXT,
  location TEXT,
  salary_range TEXT,

  -- Application details
  status application_status DEFAULT 'pending',
  failure_reason TEXT,
  resume_used TEXT, -- URL to resume file
  cover_letter_used TEXT, -- URL to cover letter file or generated text

  -- Metadata
  applied_at TIMESTAMP WITH TIME ZONE,
  user_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert applications"
  ON applications FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX idx_applications_company ON applications(company_name);
CREATE INDEX idx_applications_job_title ON applications(job_title);
CREATE INDEX idx_applications_automation_run ON applications(automation_run_id);

-- Full-text search index
CREATE INDEX idx_applications_search ON applications USING GIN(
  to_tsvector('english', coalesce(job_title, '') || ' ' || coalesce(company_name, ''))
);

-- Prevent duplicates (same company + job title within 30 days)
CREATE UNIQUE INDEX idx_applications_duplicate_prevention
  ON applications(user_id, company_name, job_title)
  WHERE applied_at > (NOW() - INTERVAL '30 days');
```

#### 3.2.6 subscriptions (Phase 3)

```sql
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Stripe details
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  -- Subscription details
  plan subscription_plan DEFAULT 'free',
  status subscription_status DEFAULT 'active',

  -- Billing period
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Usage tracking
  applications_used_today INTEGER DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

#### 3.2.7 notifications (Phase 2)

```sql
CREATE TYPE notification_type AS ENUM (
  'automation_completed',
  'automation_failed',
  'daily_limit_reached',
  'interview_detected',
  'system_announcement'
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### 3.2.8 feedback (Phase 2)

```sql
CREATE TYPE feedback_category AS ENUM ('bug', 'feature_request', 'general');
CREATE TYPE feedback_status AS ENUM ('new', 'in_review', 'resolved', 'closed');

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category feedback_category NOT NULL,
  message TEXT NOT NULL,
  screenshot_url TEXT,
  status feedback_status DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
```

### 3.3 Database Functions & Triggers

#### 3.3.1 Updated At Trigger Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

#### 3.3.2 Daily Application Counter Reset

```sql
CREATE OR REPLACE FUNCTION reset_daily_application_count()
RETURNS void AS $$
BEGIN
  UPDATE subscriptions
  SET applications_used_today = 0,
      last_reset_at = NOW()
  WHERE last_reset_at < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule via cron (pg_cron extension or external scheduler)
```

#### 3.3.3 Application Statistics Function

```sql
CREATE OR REPLACE FUNCTION get_application_stats(p_user_id UUID)
RETURNS TABLE(
  total_applications BIGINT,
  submitted BIGINT,
  failed BIGINT,
  interviews BIGINT,
  offers BIGINT,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS total_applications,
    COUNT(*) FILTER (WHERE status = 'submitted') AS submitted,
    COUNT(*) FILTER (WHERE status = 'failed') AS failed,
    COUNT(*) FILTER (WHERE status = 'interview') AS interviews,
    COUNT(*) FILTER (WHERE status = 'offer') AS offers,
    CASE
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE status = 'submitted')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS success_rate
  FROM applications
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. API Design

### 4.1 Authentication APIs

#### POST /api/auth/signup
**Description:** Create a new user account

**Request:**
```typescript
{
  email: string;
  password: string;
  fullName?: string;
}
```

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}
```

**Errors:**
- 400: Invalid email or password
- 409: Email already exists

---

#### POST /api/auth/login
**Description:** Authenticate user

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}
```

**Errors:**
- 401: Invalid credentials

---

### 4.2 Profile APIs

#### GET /api/profile
**Description:** Get current user's profile

**Response:**
```typescript
{
  id: string;
  userId: string;
  fullName: string | null;
  phone: string | null;
  resumeUrl: string | null;
  coverLetterUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

#### PUT /api/profile
**Description:** Update user profile

**Request:**
```typescript
{
  fullName?: string;
  phone?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  profile: Profile;
}
```

---

#### POST /api/profile/resume
**Description:** Upload resume

**Request:** multipart/form-data
- `file`: File (PDF or DOCX, max 5MB)

**Response:**
```typescript
{
  success: boolean;
  resumeUrl: string;
}
```

**Errors:**
- 400: Invalid file type or size
- 413: File too large

---

### 4.3 Job Preferences APIs

#### GET /api/preferences
**Description:** Get job preferences

**Response:**
```typescript
{
  id: string;
  userId: string;
  jobTitles: string[];
  locations: string[];
  keywordsInclude: string[];
  keywordsExclude: string[];
  remotePreference: 'remote_only' | 'hybrid' | 'onsite' | 'any';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'any';
  minSalary: number | null;
  maxSalary: number | null;
  dailyLimit: number;
  isActive: boolean;
}
```

---

#### PUT /api/preferences
**Description:** Update job preferences

**Request:**
```typescript
{
  jobTitles?: string[];
  locations?: string[];
  keywordsInclude?: string[];
  keywordsExclude?: string[];
  remotePreference?: 'remote_only' | 'hybrid' | 'onsite' | 'any';
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'any';
  minSalary?: number | null;
  maxSalary?: number | null;
  dailyLimit?: number;
  isActive?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  preferences: JobPreferences;
}
```

**Validation:**
- At least one job title
- At least one location
- minSalary < maxSalary
- dailyLimit between 1-100

---

### 4.4 Credentials APIs

#### POST /api/credentials
**Description:** Save job board credentials

**Request:**
```typescript
{
  platform: 'indeed' | 'linkedin' | 'ziprecruiter';
  username: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  credentialId: string;
}
```

**Security:**
- Credentials encrypted before storage
- Password never returned in responses

---

#### POST /api/credentials/test
**Description:** Test job board credentials

**Request:**
```typescript
{
  platform: 'indeed' | 'linkedin' | 'ziprecruiter';
  username: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

### 4.5 Applications APIs

#### GET /api/applications
**Description:** List applications with filtering

**Query Parameters:**
- `status`: application_status (optional)
- `search`: string (optional, searches company and title)
- `startDate`: ISO date string (optional)
- `endDate`: ISO date string (optional)
- `platform`: job_platform (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:**
```typescript
{
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

#### GET /api/applications/:id
**Description:** Get single application details

**Response:**
```typescript
{
  id: string;
  userId: string;
  automationRunId: string | null;
  jobTitle: string;
  companyName: string;
  jobBoard: 'indeed' | 'linkedin' | 'ziprecruiter';
  jobUrl: string;
  jobDescription: string | null;
  location: string | null;
  salaryRange: string | null;
  status: application_status;
  failureReason: string | null;
  resumeUsed: string | null;
  coverLetterUsed: string | null;
  appliedAt: string | null;
  userNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

#### PUT /api/applications/:id
**Description:** Update application (status, notes)

**Request:**
```typescript
{
  status?: application_status;
  userNotes?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  application: Application;
}
```

---

#### GET /api/applications/stats
**Description:** Get dashboard statistics

**Response:**
```typescript
{
  totalApplications: number;
  submitted: number;
  failed: number;
  interviews: number;
  offers: number;
  successRate: number; // percentage
  recentApplications: Application[]; // last 5
  applicationsByDay: {
    date: string;
    count: number;
  }[]; // last 30 days
}
```

---

### 4.6 Automation APIs

#### POST /api/automation/run
**Description:** Manually trigger automation

**Request:**
```typescript
{
  platforms?: ('indeed' | 'linkedin' | 'ziprecruiter')[]; // defaults to all connected
}
```

**Response:**
```typescript
{
  success: boolean;
  runId: string;
  message: string;
}
```

**Validation:**
- Resume uploaded
- Preferences set
- At least one platform credential configured
- No other run currently in progress for user

---

#### GET /api/automation/status/:runId
**Description:** Get automation run status (for polling)

**Response:**
```typescript
{
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  jobsFound: number;
  jobsFiltered: number;
  applicationsSubmitted: number;
  applicationsFailed: number;
  errorMessage: string | null;
  logs: {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
  }[];
  startedAt: string;
  completedAt: string | null;
}
```

---

#### POST /api/automation/pause/:runId
**Description:** Pause running automation

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

#### GET /api/automation/history
**Description:** Get automation run history

**Query Parameters:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response:**
```typescript
{
  runs: AutomationRun[];
  total: number;
}
```

---

### 4.7 Stripe APIs (Phase 3)

#### POST /api/stripe/create-checkout-session
**Description:** Create Stripe Checkout session

**Request:**
```typescript
{
  plan: 'pro' | 'premium';
  billingPeriod: 'monthly' | 'annual';
}
```

**Response:**
```typescript
{
  sessionId: string;
  url: string; // Redirect to this URL
}
```

---

#### GET /api/stripe/create-portal-session
**Description:** Create Stripe Billing Portal session

**Response:**
```typescript
{
  url: string; // Redirect to this URL
}
```

---

#### POST /api/webhooks/stripe
**Description:** Handle Stripe webhooks

**Headers:**
- `stripe-signature`: Webhook signature

**Events Handled:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## 5. Automation Engine Design

### 5.1 AutomationEngine Class

```typescript
class AutomationEngine {
  private userId: string;
  private runId: string;
  private browserManager: BrowserManager;
  private platforms: BasePlatform[];
  private filters: JobFilter;
  private supabase: SupabaseClient;
  private status: 'running' | 'paused' | 'stopped';

  constructor(userId: string, runId: string);

  async initialize(): Promise<void>;
  async run(): Promise<AutomationResult>;
  async pause(): Promise<void>;
  async resume(): Promise<void>;
  async cleanup(): Promise<void>;

  private async processPlatform(platform: BasePlatform): Promise<PlatformResult>;
  private async applyFilters(jobs: Job[]): Promise<Job[]>;
  private async checkDuplicates(jobs: Job[]): Promise<Job[]>;
  private async applyToJob(job: Job, platform: BasePlatform): Promise<ApplicationResult>;
  private async updateProgress(update: ProgressUpdate): Promise<void>;
  private async log(level: LogLevel, message: string): Promise<void>;
}
```

### 5.2 BasePlatform Abstract Class

```typescript
abstract class BasePlatform {
  protected browser: Browser;
  protected page: Page;
  protected credentials: Credentials;
  protected preferences: JobPreferences;

  constructor(browser: Browser, credentials: Credentials, preferences: JobPreferences);

  abstract async authenticate(): Promise<boolean>;
  abstract async searchJobs(): Promise<Job[]>;
  abstract async applyToJob(job: Job, resumePath: string, coverLetter?: string): Promise<boolean>;
  abstract async detectEasyApply(job: Job): Promise<boolean>;

  protected async fillFormField(selector: string, value: string): Promise<void>;
  protected async uploadFile(selector: string, filePath: string): Promise<void>;
  protected async clickButton(selector: string): Promise<void>;
  protected async waitForNavigation(): Promise<void>;
  protected async handleError(error: Error): Promise<void>;
}
```

### 5.3 IndeedAutomation Implementation

```typescript
class IndeedAutomation extends BasePlatform {
  private readonly LOGIN_URL = 'https://secure.indeed.com/account/login';
  private readonly SEARCH_URL = 'https://www.indeed.com/jobs';

  private readonly SELECTORS = {
    login: {
      email: '#login-email-input',
      password: '#login-password-input',
      submitButton: '#login-submit-button',
      errorMessage: '.error-message'
    },
    search: {
      keywordInput: '#text-input-what',
      locationInput: '#text-input-where',
      searchButton: '.yosegi-InlineWhatWhere-primaryButton',
      jobCard: '.job_seen_beacon',
      easyApplyButton: '.indeed-apply-button',
      jobTitle: '.jobTitle',
      companyName: '.companyName',
      location: '.companyLocation',
      salary: '.salary-snippet'
    },
    apply: {
      resumeUpload: '#resume-upload-input',
      coverLetterUpload: '#cover-letter-upload-input',
      continueButton: '#continue-button',
      submitButton: '#submit-application-button',
      successMessage: '.application-confirmation'
    }
  };

  async authenticate(): Promise<boolean> {
    try {
      await this.page.goto(this.LOGIN_URL);
      await this.fillFormField(this.SELECTORS.login.email, this.credentials.username);
      await this.fillFormField(this.SELECTORS.login.password, this.credentials.password);
      await this.clickButton(this.SELECTORS.login.submitButton);

      // Wait for redirect or error
      await Promise.race([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.page.waitForSelector(this.SELECTORS.login.errorMessage)
      ]);

      // Check if login succeeded
      const errorMessage = await this.page.$(this.SELECTORS.login.errorMessage);
      if (errorMessage) {
        const error = await errorMessage.textContent();
        throw new Error(`Login failed: ${error}`);
      }

      return true;
    } catch (error) {
      await this.handleError(error);
      return false;
    }
  }

  async searchJobs(): Promise<Job[]> {
    const jobs: Job[] = [];

    // Build search URL with preferences
    const searchParams = new URLSearchParams();
    searchParams.append('q', this.preferences.jobTitles.join(' OR '));
    searchParams.append('l', this.preferences.locations.join(','));

    if (this.preferences.remotePreference === 'remote_only') {
      searchParams.append('remotejob', '032b3046-06a3-4876-8dfd-474eb5e7ed11');
    }

    if (this.preferences.minSalary) {
      searchParams.append('salary', `${this.preferences.minSalary}+`);
    }

    const searchUrl = `${this.SEARCH_URL}?${searchParams.toString()}`;
    await this.page.goto(searchUrl);

    // Scrape job cards
    const jobCards = await this.page.$$(this.SELECTORS.search.jobCard);

    for (const card of jobCards) {
      try {
        const job: Job = {
          title: await card.$eval(this.SELECTORS.search.jobTitle, el => el.textContent?.trim() || ''),
          company: await card.$eval(this.SELECTORS.search.companyName, el => el.textContent?.trim() || ''),
          location: await card.$eval(this.SELECTORS.search.location, el => el.textContent?.trim() || ''),
          url: await card.$eval('a', el => (el as HTMLAnchorElement).href),
          salary: null,
          platform: 'indeed',
          hasEasyApply: false
        };

        // Check for salary
        const salaryElement = await card.$(this.SELECTORS.search.salary);
        if (salaryElement) {
          job.salary = await salaryElement.textContent();
        }

        // Check for Easy Apply
        const easyApplyButton = await card.$(this.SELECTORS.search.easyApplyButton);
        job.hasEasyApply = !!easyApplyButton;

        jobs.push(job);
      } catch (error) {
        console.error('Error scraping job card:', error);
        continue;
      }
    }

    return jobs;
  }

  async applyToJob(job: Job, resumePath: string, coverLetter?: string): Promise<boolean> {
    try {
      // Navigate to job page
      await this.page.goto(job.url);

      // Click Easy Apply
      await this.clickButton(this.SELECTORS.search.easyApplyButton);

      // Wait for modal/form
      await this.page.waitForSelector(this.SELECTORS.apply.resumeUpload);

      // Upload resume
      await this.uploadFile(this.SELECTORS.apply.resumeUpload, resumePath);

      // Upload cover letter if provided
      if (coverLetter) {
        const coverLetterInput = await this.page.$(this.SELECTORS.apply.coverLetterUpload);
        if (coverLetterInput) {
          await this.uploadFile(this.SELECTORS.apply.coverLetterUpload, coverLetter);
        }
      }

      // Continue through application steps
      await this.clickButton(this.SELECTORS.apply.continueButton);

      // Handle multi-step forms (loop until submit button found)
      let maxSteps = 5;
      while (maxSteps > 0) {
        const submitButton = await this.page.$(this.SELECTORS.apply.submitButton);
        if (submitButton) {
          await this.clickButton(this.SELECTORS.apply.submitButton);
          break;
        }

        const continueButton = await this.page.$(this.SELECTORS.apply.continueButton);
        if (continueButton) {
          await this.clickButton(this.SELECTORS.apply.continueButton);
        }

        maxSteps--;
      }

      // Wait for confirmation
      await this.page.waitForSelector(this.SELECTORS.apply.successMessage, { timeout: 10000 });

      return true;
    } catch (error) {
      await this.handleError(error);
      return false;
    }
  }

  async detectEasyApply(job: Job): Promise<boolean> {
    return job.hasEasyApply;
  }
}
```

### 5.4 JobFilter Class

```typescript
class JobFilter {
  private preferences: JobPreferences;
  private appliedJobs: Set<string>; // company+title hash

  constructor(preferences: JobPreferences, appliedJobs: Application[]) {
    this.preferences = preferences;
    this.appliedJobs = new Set(
      appliedJobs.map(app => this.createJobHash(app.companyName, app.jobTitle))
    );
  }

  filter(jobs: Job[]): FilterResult[] {
    return jobs.map(job => {
      const reasons: string[] = [];
      let shouldApply = true;

      // Check if already applied
      if (this.isDuplicate(job)) {
        reasons.push('Already applied to this job');
        shouldApply = false;
      }

      // Check for excluded keywords
      const excludedKeyword = this.hasExcludedKeyword(job);
      if (excludedKeyword) {
        reasons.push(`Contains excluded keyword: ${excludedKeyword}`);
        shouldApply = false;
      }

      // Check salary minimum
      if (this.isBelowMinSalary(job)) {
        reasons.push(`Salary below minimum ($${this.preferences.minSalary})`);
        shouldApply = false;
      }

      // Check Easy Apply
      if (!job.hasEasyApply) {
        reasons.push('Does not support Easy Apply');
        shouldApply = false;
      }

      return {
        job,
        shouldApply,
        skipReasons: reasons
      };
    });
  }

  private isDuplicate(job: Job): boolean {
    const hash = this.createJobHash(job.company, job.title);
    return this.appliedJobs.has(hash);
  }

  private hasExcludedKeyword(job: Job): string | null {
    const text = `${job.title} ${job.company}`.toLowerCase();
    for (const keyword of this.preferences.keywordsExclude) {
      if (text.includes(keyword.toLowerCase())) {
        return keyword;
      }
    }
    return null;
  }

  private isBelowMinSalary(job: Job): boolean {
    if (!this.preferences.minSalary || !job.salary) {
      return false;
    }

    // Parse salary from string (e.g., "$80,000 - $100,000")
    const salaryMatch = job.salary.match(/\$?([\d,]+)/);
    if (!salaryMatch) return false;

    const minSalary = parseInt(salaryMatch[1].replace(/,/g, ''));
    return minSalary < this.preferences.minSalary;
  }

  private createJobHash(company: string, title: string): string {
    return `${company.toLowerCase()}::${title.toLowerCase()}`;
  }
}
```

### 5.5 Automation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Automation Flow                           │
└─────────────────────────────────────────────────────────────┘

1. User triggers automation (manual or scheduled)
   │
   ▼
2. Create automation_run record (status: pending)
   │
   ▼
3. Fetch user preferences, credentials, resume
   │
   ▼
4. Initialize browser (headless Chrome)
   │
   ▼
5. For each connected platform:
   │
   ├─→ Authenticate with user credentials
   │   │
   │   ├─→ Success: Continue
   │   └─→ Failure: Log error, skip platform
   │
   ├─→ Search for jobs matching preferences
   │   │
   │   └─→ Scrape job listings (title, company, URL, etc.)
   │
   ├─→ Apply filters (duplicates, keywords, salary, Easy Apply)
   │   │
   │   └─→ Create list of jobs to apply to + skipped jobs
   │
   ├─→ For each filtered job:
   │   │
   │   ├─→ Check daily limit
   │   │   │
   │   │   ├─→ Limit reached: Stop
   │   │   └─→ Under limit: Continue
   │   │
   │   ├─→ Navigate to job page
   │   │
   │   ├─→ Click Easy Apply
   │   │
   │   ├─→ Fill out application form
   │   │   │
   │   │   ├─→ Upload resume
   │   │   ├─→ Upload cover letter (if available)
   │   │   └─→ Fill additional fields
   │   │
   │   ├─→ Submit application
   │   │   │
   │   │   ├─→ Success: Create application record (status: submitted)
   │   │   └─→ Failure: Create application record (status: failed), log error
   │   │
   │   └─→ Wait 30-60 seconds (rate limiting)
   │
   └─→ Update automation_run with progress

6. Close browser
   │
   ▼
7. Mark automation_run as completed
   │
   ▼
8. Send notification to user (email summary)
   │
   ▼
9. Done
```

---

## 6. Security Design

### 6.1 Authentication & Authorization

**Supabase Auth:**
- Email/password authentication
- JWT-based sessions
- Automatic token refresh
- Row Level Security (RLS) policies

**Session Management:**
- Access tokens expire after 1 hour
- Refresh tokens expire after 30 days
- Secure httpOnly cookies for token storage
- CSRF protection via same-site cookies

**Authorization:**
- RLS policies ensure users can only access their own data
- Service role key used for automation service (server-side only)
- API routes validate user authentication via middleware

### 6.2 Credential Encryption

**Encryption Strategy:**
- AES-256-GCM encryption for job board credentials
- Encryption key stored in environment variable (never in code)
- Unique initialization vector (IV) per credential
- Encrypted at application level before storing in database

**Implementation:**
```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-byte key

export function encrypt(text: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted + authTag.toString('hex'),
    iv: iv.toString('hex')
  };
}

export function decrypt(encrypted: string, iv: string): string {
  const authTag = Buffer.from(encrypted.slice(-32), 'hex');
  const encryptedText = encrypted.slice(0, -32);

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### 6.3 Input Validation & Sanitization

**Validation Strategy:**
- Zod schemas for all API inputs
- Server-side validation (never trust client)
- SQL injection prevention via parameterized queries (Supabase handles this)
- XSS prevention via React automatic escaping + DOMPurify for user-generated content

**Example Validation Schema:**
```typescript
import { z } from 'zod';

export const JobPreferencesSchema = z.object({
  jobTitles: z.array(z.string().trim().min(1)).min(1).max(5),
  locations: z.array(z.string().trim().min(1)).min(1).max(10),
  keywordsInclude: z.array(z.string().trim()).default([]),
  keywordsExclude: z.array(z.string().trim()).default([]),
  remotePreference: z.enum(['remote_only', 'hybrid', 'onsite', 'any']).default('any'),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'any']).default('full_time'),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  dailyLimit: z.number().min(1).max(100).default(10),
  isActive: z.boolean().default(true)
}).refine(data => {
  if (data.minSalary && data.maxSalary) {
    return data.minSalary <= data.maxSalary;
  }
  return true;
}, {
  message: "Minimum salary must be less than or equal to maximum salary"
});
```

### 6.4 Rate Limiting

**API Rate Limiting:**
- 100 requests per minute per user (standard)
- 10 requests per minute for authentication endpoints
- 1 request per 5 minutes for automation trigger (prevent abuse)
- Use `@upstash/ratelimit` with Redis

**Job Board Rate Limiting:**
- 30-60 second delay between applications
- Max 50 applications per session
- Exponential backoff on rate limit detection
- User-agent rotation to appear more human

### 6.5 File Upload Security

**Validation:**
- File type whitelist: PDF, DOCX only
- File size limit: 5MB
- MIME type validation (not just extension)
- Virus scanning (ClamAV or third-party API) - Phase 2+

**Storage:**
- Supabase Storage with private buckets
- Signed URLs with expiration for downloads
- RLS policies ensure users can't access others' files

---

## 7. Performance Optimization

### 7.1 Frontend Optimization

**Code Splitting:**
- Next.js automatic code splitting per route
- Dynamic imports for heavy components (e.g., dashboard charts)
- Lazy loading for below-the-fold content

**Caching:**
- Static assets cached via Vercel CDN
- API responses cached with SWR (stale-while-revalidate)
- Image optimization via Next.js Image component

**Bundle Size:**
- Tree shaking to remove unused code
- Minimize third-party dependencies
- Use lightweight alternatives (e.g., date-fns instead of moment.js)

### 7.2 Database Optimization

**Indexing:**
- Indexes on foreign keys
- Indexes on frequently queried columns (status, applied_at, user_id)
- Composite indexes for common query patterns
- Full-text search index for application search

**Query Optimization:**
- Use Supabase query builder (prevents N+1 queries)
- Select only needed columns
- Pagination to limit result sets
- Database functions for complex aggregations

**Connection Pooling:**
- Supabase handles connection pooling automatically
- Use Supabase connection pooler in production

### 7.3 Automation Performance

**Concurrency:**
- Single automation per user at a time (prevent conflicts)
- Multiple users can run automation concurrently
- Queue system for scheduled automations (process sequentially)

**Browser Optimization:**
- Headless mode (faster, less resource-intensive)
- Disable images and CSS when not needed (faster page loads)
- Reuse browser instances when possible
- Timeout long-running operations (max 2 min per application)

---

## 8. Monitoring & Observability

### 8.1 Error Tracking

**Sentry Integration:**
- Capture all unhandled exceptions
- Track user context (user ID, email)
- Source maps for production debugging
- Performance monitoring for slow transactions

**Custom Error Logging:**
```typescript
// lib/logger.ts
import * as Sentry from '@sentry/nextjs';

export function logError(error: Error, context?: Record<string, any>) {
  console.error(error);

  Sentry.captureException(error, {
    extra: context
  });
}

export function logAutomationError(
  userId: string,
  runId: string,
  platform: string,
  error: Error
) {
  Sentry.captureException(error, {
    tags: {
      userId,
      runId,
      platform,
      errorType: 'automation'
    }
  });
}
```

### 8.2 Metrics & Analytics

**Application Metrics:**
- Total signups
- Active users (DAU, WAU, MAU)
- Automation runs per day
- Applications submitted per day
- Success rate by platform
- User retention cohorts

**Business Metrics:**
- Conversion rate (free → paid)
- MRR and ARR
- Churn rate
- LTV and CAC

**Technical Metrics:**
- API response times (p50, p95, p99)
- Error rates
- Database query performance
- Browser automation success rate

### 8.3 Logging

**Structured Logging:**
```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  runId?: string;
  platform?: string;
  metadata?: Record<string, any>;
}

export function log(entry: Omit<LogEntry, 'timestamp'>) {
  const logEntry: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString()
  };

  console.log(JSON.stringify(logEntry));

  // Also send to logging service (Railway/Render has built-in)
}
```

---

## 9. Deployment Architecture

### 9.1 Phase 1: Local Development

```
Developer Machine
├── Next.js Dev Server (localhost:3000)
├── Supabase Local (Docker)
│   ├── PostgreSQL
│   ├── Auth
│   └── Storage
└── Playwright Automation (runs locally)
```

### 9.2 Phase 2: Pilot Deployment

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │   DNS & CDN     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Vercel      │
                    │  (Next.js App)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐ ┌──▼──────┐ ┌────▼─────────┐
     │    Supabase     │ │ Railway │ │   Stripe     │
     │     Cloud       │ │/Render  │ │              │
     │                 │ │         │ │              │
     │ - PostgreSQL    │ │ Auto    │ │              │
     │ - Auth          │ │ Service │ │              │
     │ - Storage       │ │         │ │              │
     └─────────────────┘ └─────────┘ └──────────────┘
```

**Deployment Process:**
1. Push to GitHub
2. GitHub Actions runs tests and linting
3. Vercel automatically deploys frontend
4. Railway/Render automatically deploys automation service
5. Supabase migrations run via CLI

### 9.3 Environment Variables

**Frontend (Vercel):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx (server-side only)
ENCRYPTION_KEY=xxx (32-byte hex)
STRIPE_PUBLISHABLE_KEY=pk_xxx (Phase 3)
STRIPE_SECRET_KEY=sk_xxx (Phase 3)
STRIPE_WEBHOOK_SECRET=whsec_xxx (Phase 3)
SENTRY_DSN=xxx (Phase 2)
RESEND_API_KEY=xxx (Phase 2)
```

**Automation Service (Railway/Render):**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
ENCRYPTION_KEY=xxx
SENTRY_DSN=xxx
NODE_ENV=production
```

### 9.4 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-automation:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up --service automation-service
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

**What to Test:**
- Utility functions (encryption, validation, formatting)
- Filter logic (JobFilter class)
- Data transformations
- API route handlers (mock Supabase)

**Tools:**
- Jest or Vitest
- React Testing Library for component tests

**Example:**
```typescript
// __tests__/lib/encryption.test.ts
import { encrypt, decrypt } from '@/lib/encryption';

describe('Encryption', () => {
  it('should encrypt and decrypt text', () => {
    const original = 'my-secret-password';
    const { encrypted, iv } = encrypt(original);
    const decrypted = decrypt(encrypted, iv);

    expect(decrypted).toBe(original);
  });

  it('should produce different encrypted values for same input', () => {
    const original = 'my-secret-password';
    const { encrypted: encrypted1 } = encrypt(original);
    const { encrypted: encrypted2 } = encrypt(original);

    expect(encrypted1).not.toBe(encrypted2);
  });
});
```

### 10.2 Integration Tests

**What to Test:**
- Database operations (Supabase queries)
- File uploads to storage
- API endpoint flows (signup → profile → preferences)
- Automation engine with mock browser

**Tools:**
- Playwright Test
- Supertest for API testing

### 10.3 End-to-End Tests

**Critical Paths:**
1. User signup → onboarding → first automation → dashboard
2. Upgrade to paid → Stripe checkout → subscription active
3. Schedule automation → cron runs → email sent

**Tools:**
- Playwright or Cypress

**Example:**
```typescript
// e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('complete onboarding flow', async ({ page }) => {
  // Signup
  await page.goto('/auth/signup');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'SecurePass123!');
  await page.click('#signup-button');

  // Onboarding Step 1: Upload resume
  await expect(page).toHaveURL('/onboarding');
  const fileInput = page.locator('#resume-upload');
  await fileInput.setInputFiles('fixtures/sample-resume.pdf');
  await page.click('#next-button');

  // Onboarding Step 2: Set preferences
  await page.fill('#job-titles', 'Software Engineer');
  await page.press('#job-titles', 'Enter');
  await page.fill('#locations', 'San Francisco, CA');
  await page.press('#locations', 'Enter');
  await page.click('#next-button');

  // Onboarding Step 3: Connect Indeed
  await page.fill('#indeed-username', 'test@indeed.com');
  await page.fill('#indeed-password', 'password123');
  await page.click('#save-credentials');
  await page.click('#finish-button');

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 11. Future Enhancements

### 11.1 Phase 4+: Advanced Features

**AI-Powered Matching:**
- Use ML model to score job relevance
- Personalized recommendations based on user behavior
- Auto-adjust preferences based on application success

**Application Tracking Integrations:**
- Connect to Greenhouse, Lever, Workday (ATS systems)
- Automatically update status when companies respond
- Parse email replies for interview invitations

**Interview Automation:**
- Detect interview invitations in email
- Automatically suggest available times (calendar integration)
- Send calendar invites

**Mobile App:**
- React Native app for iOS and Android
- Push notifications for real-time updates
- Quick status updates on-the-go

**Team/Agency Plans:**
- Manage multiple job seekers
- Bulk operations
- Reporting and analytics dashboard

**Chrome Extension:**
- Apply from any job board with one click
- Automatically detect and fill application forms
- Sync with main app

---

## 12. Appendices

### 12.1 Technology Evaluation

| Category | Options Considered | Selected | Rationale |
|----------|-------------------|----------|-----------|
| Frontend Framework | Next.js, Remix, SvelteKit | **Next.js** | Mature ecosystem, great DX, Vercel integration |
| Backend | Supabase, Firebase, Custom Node.js | **Supabase** | Open source, PostgreSQL, generous free tier |
| Automation | Puppeteer, Playwright, Selenium | **Playwright** | Modern, cross-browser, great API |
| Styling | Tailwind, CSS Modules, styled-components | **Tailwind** | Rapid development, small bundle size |
| Hosting | Vercel, Netlify, AWS | **Vercel** | Best Next.js support, easy deployments |
| Payments | Stripe, Paddle, LemonSqueezy | **Stripe** | Industry standard, robust features |
| Email | Resend, SendGrid, Mailgun | **Resend** | Modern API, great DX |

### 12.2 Third-Party Services

| Service | Purpose | Plan | Monthly Cost |
|---------|---------|------|--------------|
| Vercel | Frontend hosting | Hobby → Pro | $0 → $20 |
| Supabase | Database, auth, storage | Free → Pro | $0 → $25 |
| Railway/Render | Automation service | Developer → Team | $5 → $20 |
| Stripe | Payments | Pay-as-you-go | 2.9% + $0.30 per transaction |
| Resend | Email | Free → Pro | $0 → $20 |
| Sentry | Error tracking | Developer | $0 (up to 5k events) |
| OpenAI | AI cover letters | Pay-as-you-go | ~$0.002 per letter |

**Total estimated monthly cost (Phase 2):** ~$50-100
**Total estimated monthly cost (Phase 3, 100 users):** ~$200-300

### 12.3 Glossary

- **Easy Apply:** One-click application feature on job boards
- **Automation Run:** Single execution of the auto-apply engine
- **RLS:** Row Level Security (PostgreSQL feature)
- **Headless Browser:** Browser without UI, used for automation
- **Selector:** CSS selector used to target elements in DOM
- **Webhook:** HTTP callback triggered by external service (e.g., Stripe)
- **SSE:** Server-Sent Events (for real-time updates)

---

**Document Control:**
- **Version:** 1.0
- **Author:** Job Pilot Engineering Team
- **Last Updated:** 2025-12-28
- **Next Review:** End of Phase 1
- **Status:** Living Document (update as implementation evolves)

---

**Implementation Notes:**
- This TDD should be treated as a living document
- Update as technical decisions are made during implementation
- Reference this document during code reviews
- Use as onboarding material for future team members
