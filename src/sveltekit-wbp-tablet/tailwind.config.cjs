/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateRows: {
        '7': 'repeat(7, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
      },
      gridRow: {
        '7': '7',
        '8': '8',
      },
      gridRowStart: {
        '7': '7',
        '8': '8',
      }
    },
  },
  plugins: [],
}
