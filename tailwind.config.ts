import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 温暖文艺风配色
        primary: {
          50: "#fef6ee",
          100: "#fdecd7",
          200: "#fad4ae",
          300: "#f6b67a",
          400: "#f18f45",
          500: "#ed6f20",
          600: "#de5516",
          700: "#b84014",
          800: "#933418",
          900: "#762d16",
        },
        warm: {
          50: "#fefaf5",
          100: "#fdf3e7",
          200: "#fbe5ca",
          300: "#f7d0a1",
          400: "#f2b172",
          500: "#ed934b",
          600: "#dd7230",
          700: "#b85626",
          800: "#944525",
          900: "#793a21",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            a: {
              color: "#ed6f20",
              "&:hover": {
                color: "#de5516",
              },
            },
          },
        },
        dark: {
          css: {
            color: "#d1d5db",
            a: {
              color: "#f18f45",
              "&:hover": {
                color: "#f6b67a",
              },
            },
            h1: {
              color: "#f9fafb",
            },
            h2: {
              color: "#f9fafb",
            },
            h3: {
              color: "#f3f4f6",
            },
            h4: {
              color: "#f3f4f6",
            },
            strong: {
              color: "#f9fafb",
            },
            code: {
              color: "#f9fafb",
            },
            blockquote: {
              color: "#d1d5db",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
