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
require('../config/env');


const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpack-dev-server.config');

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
  console.log();
  console.log(err.message || err);
  console.log();
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

compiler.hooks.done.tap('done', async stats => {
  console.log("done compiling", stats.toString());
  isFirstCompile = false;
});

const serverConfig = createDevServerConfig();
const devServer = new WebpackDevServer(compiler, serverConfig);
devServer.listen(port, HOST, err => {
  if (err) {
    return console.log(err);
  }

  console.log('Starting the development server...\n');
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});