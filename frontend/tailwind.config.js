/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'sx': '520px',
        'ssx': '430px',
      },
      maxWidth: {
        'sx': '520px',
        'ssx': '430px',
      },
      height: {
        '18': '4.5rem',
        '100c': 'calc(100% - 1rem)',

      },
      width: {
        '18': '4.5rem',
      },
      colors: {
        'gray-sl': '#353a40',
        'gray-33': '#333',

        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--primary)/<alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
      },
      perspective: {
        '500': '500px',
      },
    }
  },
  //plugins: [require("flowbite/plugin")],
};
