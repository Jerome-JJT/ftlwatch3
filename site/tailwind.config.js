// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMT = require('@material-tailwind/react/utils/withMT');

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    './src/*.{tsx, ts}',
    './src/**/*.{tsx, ts}',
    './src/**/**/*.{tsx, ts}',
    './src/**/**/**/*.{tsx, ts}',
    './src/assets/*.ts',
    './index.html'
  // "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {}
  }
  // plugins: [require("tw-elements/dist/plugin.cjs")],
})
