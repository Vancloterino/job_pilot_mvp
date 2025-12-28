"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, type ProfileData } from "@/app/profile/actions";
import ResumeUpload from "./ResumeUpload";
import CoverLetterUpload from "./CoverLetterUpload";

interface ProfileFormProps {
  initialData: ProfileData;
  userEmail: string;
  userId: string;
}

export default function ProfileForm({ initialData, userEmail, userId }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email (read-only) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={initialData.full_name || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={initialData.phone || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={initialData.location || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>

            {/* Current Title */}
            <div>
              <label
                htmlFor="current_title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Current Job Title
              </label>
              <input
                type="text"
                id="current_title"
                name="current_title"
                defaultValue={initialData.current_title || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Software Engineer"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label
                htmlFor="years_of_experience"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Years of Experience
              </label>
              <input
                type="number"
                id="years_of_experience"
                name="years_of_experience"
                min="0"
                max="50"
                defaultValue={initialData.years_of_experience || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {/* Professional Links Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
          <div className="grid grid-cols-1 gap-6">
            {/* LinkedIn */}
            <div>
              <label
                htmlFor="linkedin_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                defaultValue={initialData.linkedin_url || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label
                htmlFor="portfolio_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Portfolio/Website
              </label>
              <input
                type="url"
                id="portfolio_url"
                name="portfolio_url"
                defaultValue={initialData.portfolio_url || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
          <ResumeUpload
            currentResumeUrl={initialData.resume_url}
            userId={userId}
            onUploadSuccess={() => router.refresh()}
          />
        </div>

        {/* Cover Letter Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload a cover letter template to use with your applications (optional)
          </p>
          <CoverLetterUpload
            currentCoverLetterUrl={initialData.cover_letter_url}
            userId={userId}
            onUploadSuccess={() => router.refresh()}
          />
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">Profile updated successfully!</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
