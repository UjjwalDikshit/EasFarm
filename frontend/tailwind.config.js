// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [require("daisyui")],
//   daisyui: {
//     themes: ["coffee", "carmellete"], // ✅ add both themes
//   },
// }


// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [require("daisyui"),require("@tailwindcss/typography")],// tailwind.config.js
// }
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [require("daisyui"),require("@tailwindcss/typography"),require("daisyui")],
  daisyui: {
    themes: [
      {
        weather: {
          "primary": "#3b82f6",
          "secondary": "#60a5fa",
          "accent": "#93c5fd",
          "neutral": "#1e3a8a",
          "base-100": "#1e40af",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}