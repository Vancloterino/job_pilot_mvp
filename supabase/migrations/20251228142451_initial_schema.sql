-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Extended user profile information (one-to-one with auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    current_title TEXT,
    years_of_experience INTEGER,
    resume_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- JOB PREFERENCES TABLE
-- ============================================================================
-- User's job search preferences and criteria
CREATE TABLE job_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    desired_titles TEXT[] NOT NULL DEFAULT '{}',
    desired_locations TEXT[] NOT NULL DEFAULT '{}',
    remote_only BOOLEAN NOT NULL DEFAULT false,
    hybrid_ok BOOLEAN NOT NULL DEFAULT true,
    min_salary INTEGER,
    max_salary INTEGER,
    employment_types TEXT[] NOT NULL DEFAULT '{"full-time"}',
    experience_levels TEXT[] NOT NULL DEFAULT '{}',
    industries TEXT[] NOT NULL DEFAULT '{}',
    company_sizes TEXT[] NOT NULL DEFAULT '{}',
    keywords TEXT[] NOT NULL DEFAULT '{}',
    excluded_keywords TEXT[] NOT NULL DEFAULT '{}',
    excluded_companies TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- JOB BOARD CREDENTIALS TABLE
-- ============================================================================
-- Encrypted credentials for job board accounts (Indeed, LinkedIn, Glassdoor, etc.)
CREATE TABLE job_board_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('indeed', 'linkedin', 'glassdoor', 'ziprecruiter', 'monster', 'dice')),
    encrypted_username TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    additional_data JSONB DEFAULT '{}',
    is_verified BOOLEAN NOT NULL DEFAULT false,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- ============================================================================
-- AUTOMATION RUNS TABLE
-- ============================================================================
-- Track each automation session/run
CREATE TABLE automation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Run Details
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Results
    jobs_found INTEGER NOT NULL DEFAULT 0,
    applications_submitted INTEGER NOT NULL DEFAULT 0,
    applications_failed INTEGER NOT NULL DEFAULT 0,

    -- Configuration Used
    preferences_snapshot JSONB,
    platforms_used TEXT[] NOT NULL DEFAULT '{}',

    -- Error Tracking
    error_message TEXT,
    error_details JSONB,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- APPLICATIONS TABLE
-- ============================================================================
-- Job applications submitted by the automation or manually by user
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Job Details
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_url TEXT,
    job_url TEXT NOT NULL,
    location TEXT,
    remote_type TEXT CHECK (remote_type IN ('remote', 'hybrid', 'onsite')),
    salary_range TEXT,
    job_description TEXT,

    -- Application Details
    platform TEXT NOT NULL CHECK (platform IN ('indeed', 'linkedin', 'glassdoor', 'ziprecruiter', 'monster', 'dice', 'manual')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'applied',
        'screening',
        'interviewing',
        'offer',
        'rejected',
        'withdrawn',
        'expired'
    )),
    applied_at TIMESTAMPTZ,

    -- Automation Details
    is_automated BOOLEAN NOT NULL DEFAULT false,
    automation_run_id UUID REFERENCES automation_runs(id) ON DELETE SET NULL,

    -- Application Materials Used
    resume_version TEXT,
    cover_letter_version TEXT,

    -- Tracking
    last_status_update TIMESTAMPTZ,
    response_received BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- Job Preferences indexes
CREATE INDEX idx_job_preferences_user_id ON job_preferences(user_id);

-- Job Board Credentials indexes
CREATE INDEX idx_job_board_credentials_user_id ON job_board_credentials(user_id);
CREATE INDEX idx_job_board_credentials_platform ON job_board_credentials(platform);

-- Applications indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_platform ON applications(platform);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX idx_applications_company_name ON applications(company_name);
CREATE INDEX idx_applications_automation_run_id ON applications(automation_run_id);
CREATE INDEX idx_applications_user_status ON applications(user_id, status);

-- Automation Runs indexes
CREATE INDEX idx_automation_runs_user_id ON automation_runs(user_id);
CREATE INDEX idx_automation_runs_status ON automation_runs(status);
CREATE INDEX idx_automation_runs_started_at ON automation_runs(started_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_board_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Job Preferences policies
CREATE POLICY "Users can view their own job preferences"
    ON job_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own job preferences"
    ON job_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job preferences"
    ON job_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job preferences"
    ON job_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- Job Board Credentials policies
CREATE POLICY "Users can view their own credentials"
    ON job_board_credentials FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credentials"
    ON job_board_credentials FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials"
    ON job_board_credentials FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credentials"
    ON job_board_credentials FOR DELETE
    USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
    ON applications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
    ON applications FOR DELETE
    USING (auth.uid() = user_id);

-- Automation Runs policies
CREATE POLICY "Users can view their own automation runs"
    ON automation_runs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own automation runs"
    ON automation_runs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation runs"
    ON automation_runs FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_preferences_updated_at
    BEFORE UPDATE ON job_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_board_credentials_updated_at
    BEFORE UPDATE ON job_board_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_runs_updated_at
    BEFORE UPDATE ON automation_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
