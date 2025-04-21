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
        '18' : '4.5rem',
        '100c' : 'calc(100% - 1rem)',
        
      },
      width: {
        '18' : '4.5rem',
      },
      colors: {
        'gray-sl': '#353a40',
        'gray-33': '#333',

      },
    }
  },
  //plugins: [require("flowbite/plugin")],
};
