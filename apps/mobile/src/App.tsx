import "../global.css";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";

import { GreetingForm } from "./components/GreetingForm";
import { GreetingList } from "./components/GreetingList";
import { QueryProvider } from "./providers/QueryProvider";

const App = () => (
  <QueryProvider>
    <SafeAreaView className="flex-1 bg-[#eef2eb]">
      <StatusBar style="dark" />
      <View className="flex-1 gap-6 px-5 py-6">
        <View className="gap-3">
          <Text className="text-xs font-semibold uppercase tracking-[3px] text-slate-500">
            Hello Monorepo
          </Text>
          <Text className="text-4xl font-semibold text-slate-950">
            Shared greetings on iOS through the same server and SDK.
          </Text>
          <Text className="text-base leading-6 text-slate-600">
            Set `EXPO_PUBLIC_SERVER_BASE_URL` to your Mac LAN IP so the iOS simulator or device can
            reach the local Hono server.
          </Text>
        </View>

        <GreetingForm />

        <View className="flex-1 gap-3">
          <Text className="text-lg font-semibold text-slate-900">Stored greetings</Text>
          <GreetingList />
        </View>
      </View>
    </SafeAreaView>
  </QueryProvider>
);

export default App;
