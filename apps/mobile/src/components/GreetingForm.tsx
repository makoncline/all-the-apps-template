import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

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

  return (
    <View className="rounded-[28px] bg-white p-5 shadow-sm">
      <Text className="text-sm font-medium text-slate-700">Add a greeting</Text>
      <TextInput
        className="mt-3 h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base"
        onChangeText={setName}
        placeholder="Type a name"
        value={name}
      />
      <Pressable
        className={`mt-3 h-12 items-center justify-center rounded-2xl ${
          isSubmitting || name.trim().length === 0 ? "bg-slate-300" : "bg-slate-900"
        }`}
        disabled={isSubmitting || name.trim().length === 0}
        onPress={() => {
          startTransition(() => {
            createGreetingMutation.mutate(name);
          });
        }}
      >
        <Text className="text-sm font-semibold text-white">
          {isSubmitting ? "Saving..." : "Create greeting"}
        </Text>
      </Pressable>
      {createGreetingMutation.isError ? (
        <Text className="mt-3 text-sm text-red-700">
          {createGreetingMutation.error instanceof Error
            ? createGreetingMutation.error.message
            : "Could not create greeting."}
        </Text>
      ) : null}
    </View>
  );
};
