export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">
          Job Pilot
        </h1>
        <p className="text-2xl text-muted-foreground mb-8">
          Your Personal Job Search Autopilot
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition">
            Get Started Free
          </button>
          <button className="border border-border px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
