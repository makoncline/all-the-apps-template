import type { ExpoConfig } from "@expo/config";

type AppVariant = "development" | "preview";
const DEFAULT_EAS_PROJECT_ID = "908256d7-1e3f-47ad-9260-96e799853ca1";

const getVariant = (): AppVariant =>
  process.env.APP_VARIANT === "preview" ? "preview" : "development";

const getProjectId = () => process.env.EAS_PROJECT_ID ?? DEFAULT_EAS_PROJECT_ID;

export default (): ExpoConfig => {
  const variant = getVariant();
  const isPreview = variant === "preview";
  const projectId = getProjectId();
  const channel = isPreview ? "preview" : "development";
  const plugins = isPreview ? ["expo-updates"] : ["expo-dev-client", "expo-updates"];

  return {
    name: isPreview ? "All the Apps Template Preview" : "All the Apps Template Dev",
    slug: "hello-monorepo",
    version: "1.0.0",
    orientation: "portrait",
    platforms: ["ios"],
    userInterfaceStyle: "automatic",
    scheme: isPreview ? "hello-monorepo-preview" : "hello-monorepo-dev",
    runtimeVersion: {
      policy: "appVersion"
    },
    plugins,
    ios: {
      supportsTablet: true,
      bundleIdentifier: isPreview
        ? "com.makon.hellomonorepo.preview"
        : "com.makon.hellomonorepo.dev"
    },
    updates: projectId
      ? {
          url: `https://u.expo.dev/${projectId}`,
          requestHeaders: {
            "expo-channel-name": channel
          }
        }
      : undefined,
    extra: {
      appVariant: variant,
      eas: projectId
        ? {
            projectId
          }
        : undefined
    }
  };
};
