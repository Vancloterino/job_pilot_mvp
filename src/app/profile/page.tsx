import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/auth/actions";
import { getProfile } from "./actions";
import ProfileForm from "@/components/profile/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profileResult = await getProfile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Job Pilot</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h2>
          <p className="text-gray-600">
            Manage your personal information and job search preferences
          </p>
        </div>

        {profileResult.success && profileResult.data ? (
          <ProfileForm initialData={profileResult.data} userEmail={user.email || ""} />
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Failed to load profile: {profileResult.error}</p>
          </div>
        )}
      </main>
    </div>
  );
}
