/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#000000",
          text: "#00FF88",
          dim: "#00aa66",
        },
      },
    },
  },
  plugins: [],
};
