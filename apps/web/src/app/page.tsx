import { GreetingForm } from "../components/GreetingForm";
import { GreetingList } from "../components/GreetingList";

const HomePage = () => (
  <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-12">
    <section className="space-y-4">
      <p className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        All the Apps Template
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        One greetings slice shared across web, mobile, desktop, CLI, and MCP.
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground">
        This page talks to the Hono server through the shared SDK, and the server persists greetings
        to a local libSQL/SQLite database file.
      </p>
    </section>

    <GreetingForm />

    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Stored greetings</h2>
        <p className="text-sm text-muted-foreground">Newest first</p>
      </div>
      <GreetingList />
    </section>
  </main>
);

export default HomePage;
