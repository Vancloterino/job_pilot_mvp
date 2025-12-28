"use client";

import { useState } from "react";
import { saveCredentials, testCredentials, type Platform } from "@/app/credentials/actions";

interface CredentialsFormProps {
  onSuccess?: () => void;
}

export default function CredentialsForm({ onSuccess }: CredentialsFormProps) {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [platform, setPlatform] = useState<Platform>("indeed");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await saveCredentials(formData);

    setLoading(false);

    if (result.success) {
      onSuccess?.();
      // Reset form
      e.currentTarget.reset();
      setShowPassword(false);
    } else {
      setError(result.error || "Failed to save credentials");
    }
  };

  const handleTestConnection = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTesting(true);

    const form = e.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const result = await testCredentials(formData);

    setTesting(false);

    if (result.success) {
      setSuccess("✓ Connection successful! Credentials verified and saved.");
      onSuccess?.();
      // Reset form
      form.reset();
      setShowPassword(false);
    } else {
      setError(result.error || "Connection test failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Job Board Credentials</h3>

          {/* Security Notice */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Your credentials are secure
                </p>
                <p className="text-xs text-blue-700">
                  All passwords are encrypted using AES-256-GCM encryption before being stored. We
                  never log or expose your credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Platform Selector */}
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="indeed">Indeed</option>
                <option value="linkedin">LinkedIn (Coming Soon)</option>
                <option value="glassdoor">Glassdoor (Coming Soon)</option>
                <option value="ziprecruiter">ZipRecruiter (Coming Soon)</option>
                <option value="monster">Monster (Coming Soon)</option>
                <option value="dice">Dice (Coming Soon)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Currently, only Indeed is supported. More platforms coming soon!
              </p>
            </div>

            {/* Username/Email Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username/Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || loading || platform !== "indeed"}
              className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            <button
              type="submit"
              disabled={loading || testing || platform !== "indeed"}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Save Credentials"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
