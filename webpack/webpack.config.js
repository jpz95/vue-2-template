const webpackEnvModule = require('./builder/webpack-env-module');
const webpackOutputConfig = require('./config/output/webpack-output.config');
const webpackOptimizationConfig = require('./config/optimization/webpack-optimization.config');
const webpackModuleConfig = require('./config/module/webpack-module.config');
const webpackPluginsConfig = require('./config/plugins/webpack-plugins.config');
const modules = require('./utils/modules');
const paths = require('./utils/paths');

module.exports = function(webpackEnv) {
  webpackEnvModule.setEnv(webpackEnv);

  // TODO destruct webpackEnvModule instead, after converting all webpack options.
  const isEnvDevelopment = webpackEnvModule.isEnvDevelopment();
  const isEnvProduction = webpackEnvModule.isEnvProduction();
  const shouldUseSourceMap = webpackEnvModule.shouldUseSourceMap();

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    // Stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',

    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: [
      // A client's job is to connect to WebpackDevServer by a socket and get
      // notified about changes. When you save a file, the client will either
      // apply hot updates (in case of CSS changes), or refresh the page (in
      // case of JS changes). When you make a syntax error, this client will
      // display a syntax error overlay.
      isEnvDevelopment && require.resolve('webpack-dev-server/client') + '?/',
      // Finally, this is your app's code:
      paths.appEntry,
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    ].filter(Boolean),
    output: {
      ...webpackOutputConfig(),
    },
    optimization: {
      ...webpackOptimizationConfig(),
    },
    resolve: {
      // This allows you to set a fallback for where Webpack should look for modules.
      // We placed these paths second because we want `node_modules` to "win"
      // if there are any conflicts. This matches Node resolution mechanism.
      // https://github.com/facebook/create-react-app/issues/253
      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      // These are the reasonable defaults supported by the Node ecosystem.
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      alias: {
        // Use ES5 distribution of Vue.js
        vue$: "vue/dist/vue.esm.js",
        ...(modules.webpackAliases || {}),
      },
    },
    module: {
      ...webpackModuleConfig(),
    },
    plugins: [
      ...webpackPluginsConfig(),
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
    // stats: 'none',
  }
}