/* eslint-disable no-console */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// @see https://github.com/alexbonhomme/vue-test-utils/blob/dev/docs/guides/testing-single-file-components-with-mocha-webpack.md
console.log(`Starting up the ${process.env.NODE_ENV} build...\n`);

// Ensure environment variables are read.
require('../webpack/utils/load-env');
// Ensure the custom webpack settings are read.
require('../webpack.settings');
// Load test setup file.
require('../src/setup-test-env.js');

const createMochapack = require('mochapack').default;
const optionsFromParsedArgs = require('mochapack/lib/cli/argsParser/optionsFromParsedArgs').default;

async function getMochapack(cliArgs) {
  const cliOptions = await optionsFromParsedArgs(cliArgs);

  const mochapack = createMochapack(cliOptions);
  cliArgs.mocha.files.forEach((file) => {
    mochapack.addEntry(file);
  });

  return mochapack;
}

function runTestRunner({ mochapack, watch }) {
  if (watch) {
    return mochapack.watch();
  }
  return mochapack.run();
}

// TODO use yargs, for fun
const nodeCliArgs = process.argv.slice(2);
const watchArr = nodeCliArgs.filter((cliArg) => cliArg === '--watch');

const watch = watchArr.length > 0;

// Where to look for our test files
// (relative to the working directory of the node process).
const fileGlob = 'src/**/*.spec.js';

// Available configurations supported by mochapack.
// @see node_modules/mochapack/src/cli/argsParser/parseArgv/types
// Explanations at @see https://sysgears.github.io/mochapack/docs/installation/cli-usage.html
const cliArgs = {
  mocha: {
    diff: false,
    files: [fileGlob],
    // Note: path relative to test.js.
    require: ['../src/setup-test-env.js'],
    ui: 'bdd',
    watch,
    watchIgnore: ['node_modules', '.git'],
  },
  webpack: {
    'webpack-config': 'webpack/webpack.config.js',
    'webpack-env': process.env.NODE_ENV,
  },
  mochapack: {
    interactive: false,
    clearTerminal: true,
  },
};

getMochapack(cliArgs).then(
  (mochapack) => {
    runTestRunner({ mochapack, watch });
  },
);
