/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./src/**/*.{ts,tsx}", "./index.ts"],
  theme: {
    extend: {}
  },
  plugins: []
};
