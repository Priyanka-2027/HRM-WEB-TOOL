export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-white">
      <div className="rounded-3xl border border-border bg-surface/80 p-10 text-center">
        <h1 className="text-3xl font-semibold">Unauthorized</h1>
        <p className="mt-3 text-zinc-400">You do not have access to this page.</p>
      </div>
    </main>
  );
}
