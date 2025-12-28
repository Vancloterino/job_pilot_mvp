-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Create storage buckets for resumes and cover letters

-- Create resumes bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false, -- Private bucket
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]
);

-- Create cover-letters bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cover-letters',
  'cover-letters',
  false, -- Private bucket
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]
);

-- ============================================================================
-- STORAGE POLICIES - RESUMES BUCKET
-- ============================================================================

-- Allow users to upload their own resumes
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own resumes
CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- STORAGE POLICIES - COVER LETTERS BUCKET
-- ============================================================================

-- Allow users to upload their own cover letters
CREATE POLICY "Users can upload their own cover letters"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cover-letters' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own cover letters
CREATE POLICY "Users can view their own cover letters"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'cover-letters' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own cover letters
CREATE POLICY "Users can update their own cover letters"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cover-letters' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'cover-letters' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own cover letters
CREATE POLICY "Users can delete their own cover letters"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cover-letters' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
