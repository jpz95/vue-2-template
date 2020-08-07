// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../webpack/utils/load-env');


const chalk = require('chalk');
const dedent = require('dedent');
const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('../webpack/utils/paths');
const configFactory = require('../webpack/webpack.config');
const createDevServerConfig = require('../webpack/webpack-dev-server.config');
const printNewLine = require('../webpack/utils/print-new-line');

const config = configFactory('development');
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const appName = require(paths.appPackageJson).name;

const HOST = process.env.HOST || '0.0.0.0';
const port = 4000;

let compiler;
try {
  compiler = webpack(config);
} catch (err) {
  console.log('Failed to compile.');
  printNewLine();
  console.log(err.message || err);
  printNewLine();
  process.exit(1);
}

// "invalid" event fires when you have changed a file, and webpack is
// recompiling a bundle. WebpackDevServer takes care to pause serving the
// bundle, so if you refresh, it'll wait instead of serving the old one.
// "invalid" is short for "bundle invalidated", it doesn't imply any errors.
compiler.hooks.invalid.tap('invalid', () => {
  console.log('Compiling...');
});

let isFirstCompile = true;

// "done" event fires when webpack has finished recompiling the bundle.
// Whether or not you have warnings or errors, you will get this event.
compiler.hooks.done.tap('done', async stats => {
  const statsJson = stats.toJson({
    all: false,
    warnings: true,
    errors: true,
  });

  const isSuccessful = !statsJson.errors.length && !statsJson.warnings.length;
  if (isSuccessful && isFirstCompile) {
    printNewLine();
    console.log(dedent`
      You can now view ${chalk.bold(appName)} in the browser

        ${chalk.bold('Local:')} ${chalk.blue(protocol + '://localhost:' + port)}
    `);

    isFirstCompile = false;
  }
});

const serverConfig = createDevServerConfig();
const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(port, HOST, err => {
  if (err) {
    return console.log(err);
  }

  console.log('Starting the development server...\n');
  // TODO open browser at localhost with 'open' package
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});