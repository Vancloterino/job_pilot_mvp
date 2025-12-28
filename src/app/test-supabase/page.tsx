import { createClient } from "@/lib/supabase/server";

export default async function TestSupabasePage() {
  let connectionStatus = "Unknown";
  let errorMessage = "";
  const envCheck = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  try {
    const supabase = await createClient();

    // Try to get the current session (will be null if not logged in, but connection should work)
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      connectionStatus = "Error";
      errorMessage = error.message;
    } else {
      connectionStatus = "Success! ✅";
      errorMessage = session ? "User is logged in" : "No active session (this is normal)";
    }
  } catch (error) {
    connectionStatus = "Failed ❌";
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={envCheck.url ? "text-green-600" : "text-red-600"}>
                {envCheck.url ? "✅" : "❌"}
              </span>
              <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
              {envCheck.url && (
                <span className="text-gray-600 text-sm ml-auto">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={envCheck.anonKey ? "text-green-600" : "text-red-600"}>
                {envCheck.anonKey ? "✅" : "❌"}
              </span>
              <span className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              {envCheck.anonKey && (
                <span className="text-gray-600 text-sm ml-auto">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={envCheck.serviceKey ? "text-green-600" : "text-red-600"}>
                {envCheck.serviceKey ? "✅" : "❌"}
              </span>
              <span className="font-mono text-sm">SUPABASE_SERVICE_ROLE_KEY</span>
              {envCheck.serviceKey && <span className="text-gray-600 text-sm ml-auto">Set ✓</span>}
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Status: </span>
              <span
                className={
                  connectionStatus.includes("Success")
                    ? "text-green-600 font-semibold"
                    : connectionStatus.includes("Failed")
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                }
              >
                {connectionStatus}
              </span>
            </div>
            {errorMessage && (
              <div>
                <span className="font-semibold">Message: </span>
                <span className="text-gray-700">{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">What This Test Does</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-900">
            <li>Checks if all required environment variables are set</li>
            <li>Attempts to connect to your local Supabase instance</li>
            <li>Verifies that the Supabase client can communicate with the API</li>
          </ul>
          {connectionStatus.includes("Success") && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
              <p className="text-green-900 font-semibold">
                🎉 Your Supabase setup is working correctly!
              </p>
              <p className="text-green-800 text-sm mt-2">
                You can now proceed with creating the database schema.
              </p>
            </div>
          )}
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
