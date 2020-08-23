const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const minimizers = require('./_minimizers');

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
      minSize: 30000, // 30 kb
      automaticNameDelimiter: '-',
      // TODO report bug for html-webpack-plugin.
      // plugin defines 'vendors' chunk's name as undefined, filtering it out
      // when determining which chunks to insert as scripts into html.
      name: false,
      cacheGroups: {
        // Creates a named vendor chunk, if its greater than the minSize threshold.
        namedVendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            if (!module.nameForCondition) {
              return module.identifier();
            }

            // Get the name. E.g. node_modules/packageName/not/this/part.js
            //  or node_modules/packageName
            const matches =
              module
                .nameForCondition()
                .match(/[\\/]node_modules[\\/](.*?)([\\/|$])/) || [];

            const packageName = matches.length > 0 ? matches[1] : module.identifier();

            // npm package names are URL-safe, but some servers
            // don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
        // Creates a generic vendors chunk (default group).
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
      },
    },

    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  };
};
