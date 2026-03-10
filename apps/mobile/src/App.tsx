import "../global.css";

import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { SafeAreaView, View } from "react-native";

import { GreetingForm } from "@/components/GreetingForm";
import { GreetingList } from "@/components/GreetingList";
import { Text } from "@/components/ui/text";
import { QueryProvider } from "@/providers/QueryProvider";

const AppContent = () => {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-1 gap-6 px-5 py-6">
        <View className="gap-3">
          <Text className="text-xs font-semibold uppercase tracking-[3px] text-muted-foreground">
            Hello Monorepo
          </Text>
          <Text className="text-4xl font-semibold text-foreground">
            Shared greetings on iOS through the same server and SDK.
          </Text>
          <Text className="leading-6 text-muted-foreground">
            Set `EXPO_PUBLIC_SERVER_BASE_URL` to your Mac LAN IP so the iOS
            simulator or device can reach the local Hono server.
          </Text>
        </View>

        <GreetingForm />

        <View className="flex-1 gap-3">
          <Text className="text-lg font-semibold text-foreground">
            Stored greetings
          </Text>
          <GreetingList />
        </View>
      </View>
    </SafeAreaView>
  );
};

const App = () => (
  <QueryProvider>
    <AppContent />
  </QueryProvider>
);

export default App;
