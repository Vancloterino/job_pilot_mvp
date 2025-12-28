-- Verify Database Schema
-- This script checks that all tables were created correctly

-- List all tables in public schema
SELECT
    table_name,
    table_type
FROM
    information_schema.tables
WHERE
    table_schema = 'public'
ORDER BY
    table_name;

-- Count of tables (should be 5: profiles, job_preferences, job_board_credentials, automation_runs, applications)
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public';

-- List all indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename, indexname;

-- List all RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
ORDER BY
    tablename, policyname;

-- Verify triggers
SELECT
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM
    information_schema.triggers
WHERE
    trigger_schema = 'public'
ORDER BY
    event_object_table, trigger_name;
