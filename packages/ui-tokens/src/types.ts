export const themeColorNames = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring"
] as const;

export type ThemeColorName = (typeof themeColorNames)[number];

export type ThemeColors = Record<ThemeColorName, string>;

export interface ThemeDefinition {
  colors: ThemeColors;
}

export interface ThemeTokens {
  light: ThemeDefinition;
  dark: ThemeDefinition;
  radii: {
    base: string;
  };
  desktop: {
    windowBackground: string;
  };
}

export type ThemeName = "light" | "dark";

export interface GeneratedArtifact {
  path: string;
  content: string;
}
