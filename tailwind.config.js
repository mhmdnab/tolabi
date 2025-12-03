/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brandYellow: '#F6E049',
        frameBlack: '#171717',
        arrowRed: '#D70000'
      },
      fontFamily: {
        work: ['"Work Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
