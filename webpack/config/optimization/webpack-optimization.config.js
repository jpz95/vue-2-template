const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const minimizers = require('./_minimizers');
const settings = require('../../webpack.settings');

module.exports = (envState) => {
  const { isEnvProduction } = envState;

  return {
    minimize: isEnvProduction,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin(
        minimizers.configureTerserPlugin(envState),
      ),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin(
        minimizers.configureOptimizeCSSAssetsPlugin(envState),
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
