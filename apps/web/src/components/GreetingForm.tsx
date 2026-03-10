"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import type { FormEvent } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { greetingsApi } from "@/lib/api";

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
    <Card>
      <CardHeader>
        <CardTitle>Add a greeting</CardTitle>
        <CardDescription>
          Create a shared greeting through the server-backed API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Type a name"
              value={name}
            />
          </div>
          <Button
            disabled={isSubmitting || name.trim().length === 0}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Create greeting"}
          </Button>
          {createGreetingMutation.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not create greeting</AlertTitle>
              <AlertDescription>
                {createGreetingMutation.error instanceof Error
                  ? createGreetingMutation.error.message
                  : "Request failed."}
              </AlertDescription>
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
};
