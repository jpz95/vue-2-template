const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const minimizers = require('./_minimizers');
const webpackEnvModule = require('../../builder/webpack-env-module');
const settings = require('../../webpack.settings');

module.exports = () => {
  const isEnvProduction = webpackEnvModule.isEnvProduction();
  // TODO should be passed from webpack.config.js
  const env = {
    shouldUseSourceMap: webpackEnvModule.shouldUseSourceMap(),
    isEnvProductionProfile: webpackEnvModule.isEnvProductionProfile(),
  };

  return {
    minimize: isEnvProduction,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin(
        minimizers.configureTerserPlugin(env),
      ),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin(
        minimizers.configureOptimizeCSSAssetsPlugin(env),
      ),
    ],

    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      // Splits chunks if it exceeds this threshold.
      minSize: 15000, // 15 kb
      automaticNameDelimiter: '-',
      // TODO report bug for html-webpack-plugin.
      // plugin defines 'vendors' chunk's name as undefined, filtering it out
      // when determining which chunks to insert as scripts into html.
      name: false,
      cacheGroups: settings.chunkGroups,
    },

    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  };
};
