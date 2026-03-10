import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { greetingsApi } from "@/lib/api";

export const GreetingList = () => {
  const greetingsQuery = useQuery({
    queryKey: ["greetings"],
    queryFn: greetingsApi.list
  });

  if (greetingsQuery.isPending) {
    return (
      <Text className="text-sm text-muted-foreground">
        Loading greetings...
      </Text>
    );
  }

  if (greetingsQuery.isError) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="pt-6">
          <Text className="text-sm text-destructive">
            {greetingsQuery.error instanceof Error
              ? greetingsQuery.error.message
              : "Request failed."}
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <FlatList
      contentContainerClassName="gap-3 pb-6"
      data={greetingsQuery.data.greetings}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <Text className="text-sm text-muted-foreground">
              No greetings yet.
            </Text>
          </CardContent>
        </Card>
      }
      renderItem={({ item }) => (
        <Card>
          <CardHeader>
            <CardTitle>{item.message}</CardTitle>
            <CardDescription>
              {new Date(item.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    />
  );
};
