/* eslint-disable no-console */

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

console.log(`Starting up the ${process.env.NODE_ENV} build...\n`);

// Ensure environment variables are read.
require('../webpack/utils/load-env');
// Ensure the custom webpack settings are read.
require('../webpack.settings');

const chalk = require('chalk');
const dedent = require('dedent');
const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../webpack/webpack.config');
const paths = require('../webpack/utils/paths');
const printNewLine = require('../webpack/utils/print-new-line');

function build(config) {
  console.log('Bundling the project...');
  printNewLine(1);

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;

      if (err) {
        if (!err.message) {
          return reject(new Error(err));
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage
            += `\nCompileError: Begins at CSS selector ${err.postcssNode.selector}`;
        }

        messages = {
          errors: [errMessage],
          warnings: [],
        };
      } else {
        messages = stats.toJson({
          all: false,
          errors: true,
          wanrings: true,
        });
      }

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        const firstError = messages.errors.join();
        return reject(new Error(firstError));
      }

      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}

// load "production" config
const config = configFactory('production');
// empty build folder
fs.emptyDirSync(paths.appBuild);
// copy public folder into build folder
copyPublicFolder();

// feed config into webpack
build(config).then(() => {
  console.log(
    `Deployable bundle available at
    ${chalk.blue(paths.appBuild)}`,
  );
}).catch((err) => {
  const message = err && err.message;

  printNewLine(2);
  console.log(dedent`
    ${chalk.red('Failed to build bundle')}
    ${message || err}
  `);
  printNewLine(1);

  process.exit(1);
});
