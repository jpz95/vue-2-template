/**
 * Copyright (c) 2015-2020, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * facebook.license file in the licenses directory of this source tree.
 */

const nodeExternals = require('webpack-node-externals');

const webpackOutputConfig = require('./config/webpack-output.config');
const webpackOptimizationConfig = require('./config/webpack-optimization.config');
const webpackModuleConfig = require('./config/webpack-module.config');
const webpackPluginsConfig = require('./config/webpack-plugins.config');
const webpackResolveConfig = require('./config/webpack-resolve.config');
const getEnvState = require('./utils/get-env-state');
const paths = require('./utils/paths');

module.exports = function webpackConfig(webpackEnv) {
  const envState = getEnvState(webpackEnv);
  const {
    isEnvDevelopment,
    isEnvTest,
    isEnvProduction,
    shouldUseSourceMap,
  } = envState;

  return {
    mode: isEnvProduction ? 'production' : 'development',
    // Stop compilation early in production
    bail: isEnvProduction,
    // eslint-disable-next-line no-nested-ternary
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment
        ? 'cheap-module-source-map'
        : 'inline-cheap-module-source-map',

    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: [
      // A client's job is to connect to WebpackDevServer by a socket and get
      // notified about changes. When you save a file, the client will either
      // apply hot updates (in case of CSS changes), or refresh the page (in
      // case of JS changes). When you make a syntax error, this client will
      // display a syntax error overlay.
      isEnvDevelopment && `${require.resolve('webpack-dev-server/client')}?/`,
      // Finally, this is your app's code:
      paths.appEntry,
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    ].filter(Boolean),

    output: {
      ...webpackOutputConfig(envState),
    },
    optimization: {
      ...webpackOptimizationConfig(envState),
    },
    resolve: {
      ...webpackResolveConfig(envState),
    },
    module: {
      ...webpackModuleConfig(envState),
    },
    plugins: [
      ...webpackPluginsConfig(envState),
    ].filter(Boolean),

    externals: [
      isEnvTest && nodeExternals(),
    ].filter(Boolean),

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      process: 'mock',
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },

    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
};
