"use client";

import { useQuery } from "@tanstack/react-query";

import { greetingsApi } from "../lib/api";

export const GreetingList = () => {
  const greetingsQuery = useQuery({
    queryKey: ["greetings"],
    queryFn: greetingsApi.list
  });

  if (greetingsQuery.isPending) {
    return <p className="text-sm text-ink/70">Loading greetings...</p>;
  }

  if (greetingsQuery.isError) {
    return (
      <p className="rounded-2xl border border-red-300 bg-white/70 px-4 py-3 text-sm text-red-700">
        {greetingsQuery.error instanceof Error ? greetingsQuery.error.message : "Request failed."}
      </p>
    );
  }

  if (greetingsQuery.data.greetings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 p-6 text-sm text-ink/70">
        No greetings yet. Add one to verify the shared DB CRUD flow.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {greetingsQuery.data.greetings.map((greeting) => (
        <li
          key={greeting.id}
          className="rounded-3xl border border-white/60 bg-white/75 p-4 shadow-[0_12px_40px_rgba(31,42,31,0.08)] backdrop-blur"
        >
          <p className="text-lg font-semibold">{greeting.message}</p>
          <p className="mt-1 text-sm text-ink/60">
            Created for {greeting.name} on {new Date(greeting.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
};
