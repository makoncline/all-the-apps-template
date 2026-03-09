import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";

import { greetingsApi } from "../lib/api";

export const GreetingList = () => {
  const greetingsQuery = useQuery({
    queryKey: ["greetings"],
    queryFn: greetingsApi.list
  });

  if (greetingsQuery.isPending) {
    return <Text className="text-sm text-slate-500">Loading greetings...</Text>;
  }

  if (greetingsQuery.isError) {
    return (
      <View className="rounded-3xl bg-red-50 p-4">
        <Text className="text-sm text-red-700">
          {greetingsQuery.error instanceof Error ? greetingsQuery.error.message : "Request failed."}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerClassName="gap-3 pb-6"
      data={greetingsQuery.data.greetings}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
          <Text className="text-sm text-slate-500">No greetings yet.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <Text className="text-lg font-semibold text-slate-900">{item.message}</Text>
          <Text className="mt-1 text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      )}
    />
  );
};
