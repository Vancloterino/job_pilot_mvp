"use client";

import { useState } from "react";
import { deleteCredentials, type CredentialData } from "@/app/credentials/actions";

interface CredentialsListProps {
  credentials: CredentialData[];
  onUpdate: () => void;
}

const PLATFORM_NAMES: Record<string, string> = {
  indeed: "Indeed",
  linkedin: "LinkedIn",
  glassdoor: "Glassdoor",
  ziprecruiter: "ZipRecruiter",
  monster: "Monster",
  dice: "Dice",
};

export default function CredentialsList({ credentials, onUpdate }: CredentialsListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (credentialId: string, platform: string) => {
    if (!confirm(`Are you sure you want to delete your ${PLATFORM_NAMES[platform]} credentials?`)) {
      return;
    }

    setDeleting(credentialId);

    const result = await deleteCredentials(credentialId);

    setDeleting(null);

    if (result.success) {
      onUpdate();
    } else {
      alert(`Failed to delete credentials: ${result.error}`);
    }
  };

  if (credentials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No credentials saved</h3>
        <p className="text-sm text-gray-500">
          Add your job board credentials above to start automating your job applications.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Credentials</h3>
        <div className="space-y-3">
          {credentials.map((credential) => (
            <div
              key={credential.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {PLATFORM_NAMES[credential.platform] || credential.platform}
                  </p>
                  <p className="text-xs text-gray-500">{credential.username}</p>
                  {credential.is_verified && credential.last_verified_at && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Verified {new Date(credential.last_verified_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(credential.id, credential.platform)}
                  disabled={deleting === credential.id}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  {deleting === credential.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
