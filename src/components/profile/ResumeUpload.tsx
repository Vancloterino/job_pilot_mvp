"use client";

import { useState } from "react";
import { uploadFile, validateFile, deleteFile } from "@/lib/storage";
import { updateResumeUrl } from "@/app/profile/actions";

interface ResumeUploadProps {
  currentResumeUrl: string | null;
  userId: string;
  onUploadSuccess?: () => void;
}

export default function ResumeUpload({
  currentResumeUrl,
  userId,
  onUploadSuccess,
}: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [deleting, setDeleting] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file using existing helper
    const validation = validateFile(file, "resumes");
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setUploading(true);

    // Upload file using existing helper
    const result = await uploadFile({
      file,
      bucket: "resumes",
      userId,
    });

    if (result.success && result.url) {
      // Update profile with new resume URL
      const updateResult = await updateResumeUrl(result.url);

      if (updateResult.success) {
        setUploading(false);
        onUploadSuccess?.();
      } else {
        setError(updateResult.error || "Failed to update profile");
        setUploading(false);
      }
    } else {
      setError(result.error || "Upload failed");
      setUploading(false);
    }

    // Reset input
    e.target.value = "";
  };

  const handleDelete = async () => {
    if (!currentResumeUrl) return;

    if (!confirm("Are you sure you want to delete your resume?")) return;

    setDeleting(true);
    setError("");

    // Extract file path from URL
    const urlParts = currentResumeUrl.split("/");
    const filePath = `${userId}/${urlParts[urlParts.length - 1]}`;

    // Delete file using existing helper
    const deleteResult = await deleteFile("resumes", filePath);

    if (deleteResult.success) {
      // Update profile to remove resume URL
      const updateResult = await updateResumeUrl("");

      if (updateResult.success) {
        setDeleting(false);
        onUploadSuccess?.();
      } else {
        setError(updateResult.error || "Failed to update profile");
        setDeleting(false);
      }
    } else {
      setError(deleteResult.error || "Failed to delete resume");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentResumeUrl ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">Resume uploaded</p>
              <p className="text-xs text-gray-500">PDF or Word document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              View
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="resume-upload"
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              {uploading ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
