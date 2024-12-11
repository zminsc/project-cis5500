const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customPrimary: "#FFF",
        customSecondary: "#F69F19",
        customTertiary: "#FFC170",
        customGreen: "#046E1B",
        customBlue: "#75B8EE",
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

