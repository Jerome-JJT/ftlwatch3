/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");
 

export default withMT({
  content: ["./src/**/**/*.{tsx, ts}", "./src/assets/*.ts", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
})

