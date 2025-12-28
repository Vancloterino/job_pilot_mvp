"use client";

import { useState } from "react";
import { saveJobPreferences, type JobPreferencesData } from "@/app/preferences/actions";

interface JobPreferencesFormProps {
  initialData: JobPreferencesData;
}

export default function JobPreferencesForm({ initialData }: JobPreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await saveJobPreferences(formData);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to save preferences");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        {/* Job Titles Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desired Job Titles</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="desired_titles"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Job Titles (comma-separated)
              </label>
              <input
                type="text"
                id="desired_titles"
                name="desired_titles"
                defaultValue={initialData.desired_titles.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Software Engineer, Full Stack Developer, Backend Engineer"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter job titles you're interested in, separated by commas
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Preferences</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="desired_locations"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preferred Locations (comma-separated)
              </label>
              <input
                type="text"
                id="desired_locations"
                name="desired_locations"
                defaultValue={initialData.desired_locations.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="San Francisco, New York, Remote"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remote_only"
                  value="true"
                  defaultChecked={initialData.remote_only}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Remote positions only</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hybrid_ok"
                  value="true"
                  defaultChecked={initialData.hybrid_ok}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Open to hybrid positions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Salary Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Expectations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary ($)
              </label>
              <input
                type="number"
                id="min_salary"
                name="min_salary"
                min="0"
                step="1000"
                defaultValue={initialData.min_salary || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="80000"
              />
            </div>

            <div>
              <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary ($)
              </label>
              <input
                type="number"
                id="max_salary"
                name="max_salary"
                min="0"
                step="1000"
                defaultValue={initialData.max_salary || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="150000"
              />
            </div>
          </div>
        </div>

        {/* Employment Type Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Type</h3>
          <div>
            <label
              htmlFor="employment_types"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Employment Types (comma-separated)
            </label>
            <input
              type="text"
              id="employment_types"
              name="employment_types"
              defaultValue={initialData.employment_types.join(", ")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="full-time, contract, part-time"
            />
            <p className="mt-1 text-xs text-gray-500">
              e.g., full-time, part-time, contract, internship
            </p>
          </div>
        </div>

        {/* Experience & Additional Filters */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Filters</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label
                htmlFor="experience_levels"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Experience Levels (comma-separated)
              </label>
              <input
                type="text"
                id="experience_levels"
                name="experience_levels"
                defaultValue={initialData.experience_levels.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="mid-level, senior, lead"
              />
            </div>

            <div>
              <label htmlFor="industries" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Industries (comma-separated)
              </label>
              <input
                type="text"
                id="industries"
                name="industries"
                defaultValue={initialData.industries.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="technology, finance, healthcare"
              />
            </div>

            <div>
              <label
                htmlFor="company_sizes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Sizes (comma-separated)
              </label>
              <input
                type="text"
                id="company_sizes"
                name="company_sizes"
                defaultValue={initialData.company_sizes.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="startup, small, medium, large, enterprise"
              />
            </div>
          </div>
        </div>

        {/* Keywords Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keywords</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Include Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                defaultValue={initialData.keywords.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="react, typescript, aws, python"
              />
              <p className="mt-1 text-xs text-gray-500">Jobs must include these keywords</p>
            </div>

            <div>
              <label
                htmlFor="excluded_keywords"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Exclude Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="excluded_keywords"
                name="excluded_keywords"
                defaultValue={initialData.excluded_keywords.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="junior, intern, unpaid"
              />
              <p className="mt-1 text-xs text-gray-500">
                Jobs with these keywords will be excluded
              </p>
            </div>

            <div>
              <label
                htmlFor="excluded_companies"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Excluded Companies (comma-separated)
              </label>
              <input
                type="text"
                id="excluded_companies"
                name="excluded_companies"
                defaultValue={initialData.excluded_companies.join(", ")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Company A, Company B"
              />
              <p className="mt-1 text-xs text-gray-500">Skip applications to these companies</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">Job preferences saved successfully!</p>
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
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
