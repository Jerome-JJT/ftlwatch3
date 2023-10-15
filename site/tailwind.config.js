// eslint-disable-next-line @typescript-eslint/no-var-requires
import withMT from '@material-tailwind/react/utils/withMT';

/** @type {import('tailwindcss').Config} */
export default withMT({
  darkMode: false,
  content:  [
    './src/*.{tsx, ts}',
    './src/**/*.{tsx, ts}',
    './src/**/**/*.{tsx, ts}',
    './src/**/**/**/*.{tsx, ts}',
    './src/assets/*.ts',
    './src/*.ts',
    './index.html',
  // "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'animals': 'url(\'/static/animals.png\')',
      },
      fontFamily: {
        'roboto': ['Roboto'],
      },
    },


  },
  // },
  // plugins: [require("tw-elements/dist/plugin.cjs")],
});
