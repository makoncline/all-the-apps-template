import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a greeting</CardTitle>
        <CardDescription>
          Create a shared greeting through the server-backed API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="gap-4">
          <Input
            onChangeText={setName}
            placeholder="Type a name"
            value={name}
          />
          <Button
            disabled={isSubmitting || name.trim().length === 0}
            onPress={() => {
              startTransition(() => {
                createGreetingMutation.mutate(name);
              });
            }}
          >
            <Text>{isSubmitting ? "Saving..." : "Create greeting"}</Text>
          </Button>
          {createGreetingMutation.isError ? (
            <Text className="text-sm text-destructive">
              {createGreetingMutation.error instanceof Error
                ? createGreetingMutation.error.message
                : "Could not create greeting."}
            </Text>
          ) : null}
        </View>
      </CardContent>
    </Card>
  );
};
