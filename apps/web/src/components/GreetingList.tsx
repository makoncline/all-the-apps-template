"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { greetingsApi } from "@/lib/api";

export const GreetingList = () => {
  const greetingsQuery = useQuery({
    queryKey: ["greetings"],
    queryFn: greetingsApi.list
  });

  if (greetingsQuery.isPending) {
    return (
      <p className="text-sm text-muted-foreground">Loading greetings...</p>
    );
  }

  if (greetingsQuery.isError) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="pt-6 text-sm text-destructive">
          {greetingsQuery.error instanceof Error
            ? greetingsQuery.error.message
            : "Request failed."}
        </CardContent>
      </Card>
    );
  }

  if (greetingsQuery.data.greetings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No greetings yet. Add one to verify the shared DB CRUD flow.
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {greetingsQuery.data.greetings.map((greeting) => (
        <li key={greeting.id}>
          <Card>
            <CardHeader>
              <CardTitle>{greeting.message}</CardTitle>
              <CardDescription>
                Created for {greeting.name} on{" "}
                {new Date(greeting.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
};
