"use client";

import { useState } from "react";
import { uploadFile, validateFile, listUserFiles, deleteFile } from "@/lib/storage";
import type { StorageBucket } from "@/lib/storage";

export default function TestStoragePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bucket, setBucket] = useState<StorageBucket>("resumes");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [files, setFiles] = useState<Array<{ name: string; path: string }>>([]);
  const [testUserId] = useState("00000000-0000-0000-0000-000000000000"); // Test user ID

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, bucket);
    if (!validation.valid) {
      setUploadStatus(`Validation failed: ${validation.error}`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("No file selected");
      return;
    }

    setUploadStatus("Uploading...");

    const result = await uploadFile({
      file: selectedFile,
      bucket,
      userId: testUserId,
    });

    if (result.success) {
      setUploadStatus(`Upload successful! File path: ${result.path}`);
      setUploadedUrl(result.url || "");
      await loadFiles();
    } else {
      setUploadStatus(`Upload failed: ${result.error}`);
    }
  };

  const loadFiles = async () => {
    const result = await listUserFiles(bucket, testUserId);
    if (result.success && result.files) {
      setFiles(result.files);
    }
  };

  const handleDelete = async (filePath: string) => {
    const result = await deleteFile(bucket, filePath);
    if (result.success) {
      setUploadStatus("File deleted successfully");
      await loadFiles();
    } else {
      setUploadStatus(`Delete failed: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Storage Test Page</h1>

        {/* Bucket Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Storage Bucket</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="resumes"
                checked={bucket === "resumes"}
                onChange={(e) => setBucket(e.target.value as StorageBucket)}
                className="w-4 h-4"
              />
              <span>Resumes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cover-letters"
                checked={bucket === "cover-letters"}
                onChange={(e) => setBucket(e.target.value as StorageBucket)}
                className="w-4 h-4"
              />
              <span>Cover Letters</span>
            </label>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90"
              />
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`rounded-lg shadow p-6 mb-6 ${
              uploadStatus.includes("failed") || uploadStatus.includes("Validation")
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Status</h2>
            <p
              className={
                uploadStatus.includes("failed") || uploadStatus.includes("Validation")
                  ? "text-red-700"
                  : "text-green-700"
              }
            >
              {uploadStatus}
            </p>
            {uploadedUrl && (
              <p className="text-sm text-gray-600 mt-2 break-all">URL: {uploadedUrl}</p>
            )}
          </div>
        )}

        {/* File List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Uploaded Files</h2>
            <button
              onClick={loadFiles}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Refresh
            </button>
          </div>
          {files.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet</p>
          ) : (
            <ul className="space-y-2">
              {files.map((file) => (
                <li
                  key={file.path}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-sm font-mono">{file.name}</span>
                  <button
                    onClick={() => handleDelete(file.path)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-900">
            <li>Select a storage bucket (Resumes or Cover Letters)</li>
            <li>Choose a PDF or Word document (max 5MB)</li>
            <li>Click Upload to test the upload functionality</li>
            <li>Click Refresh to see all uploaded files</li>
            <li>Click Delete to test file deletion</li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
            <p className="text-yellow-900 font-semibold">Note:</p>
            <p className="text-yellow-800 text-sm mt-1">
              This test page uses a test user ID. In production, this will use the actual
              authenticated user's ID from Supabase Auth.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="text-primary hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
