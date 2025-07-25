import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

const config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        red: "#FFDCDC",
        blue: "#DCE4FF",
        green: "#66ff7f",
        yellow: "#FFF5DC",
        purple: "#6283F8",
      },
      height: {
        "screen-with-navbar": "calc(100vh - 56px)",
      },
    },
  },
  plugins: [],
}) as Config;
export default config;
