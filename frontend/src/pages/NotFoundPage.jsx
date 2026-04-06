export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-white">
      <div className="rounded-3xl border border-border bg-surface/80 p-10 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-zinc-400">The route you requested does not exist yet.</p>
      </div>
    </main>
  );
}
