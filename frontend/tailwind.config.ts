import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF445F',   
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}

export default config
