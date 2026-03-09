"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";

import { greetingsApi } from "../lib/api";

export const GreetingForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [isPendingTransition, startTransition] = useTransition();

  const createGreetingMutation = useMutation({
    mutationFn: greetingsApi.create,
    onSuccess: async () => {
      setName("");
      await queryClient.invalidateQueries({ queryKey: ["greetings"] });
    }
  });

  const isSubmitting = createGreetingMutation.isPending || isPendingTransition;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      createGreetingMutation.mutate(name);
    });
  };

  return (
    <form
      className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_60px_rgba(31,42,31,0.08)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <label className="block text-sm font-medium text-ink/80" htmlFor="name">
        Add a greeting
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="name"
          className="h-12 flex-1 rounded-2xl border border-ink/10 bg-sun px-4 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/30"
          name="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Type a name"
          value={name}
        />
        <button
          className="h-12 rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-[#172017] disabled:cursor-not-allowed disabled:bg-ink/40"
          disabled={isSubmitting || name.trim().length === 0}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Create greeting"}
        </button>
      </div>
      {createGreetingMutation.isError ? (
        <p className="mt-3 text-sm text-red-700">
          {createGreetingMutation.error instanceof Error
            ? createGreetingMutation.error.message
            : "Could not create greeting."}
        </p>
      ) : null}
    </form>
  );
};
