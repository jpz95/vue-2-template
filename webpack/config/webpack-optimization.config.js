const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const configureTerserPlugin = ({ shouldUseSourceMap, isEnvProductionProfile }) => ({
  terserOptions: {
    parse: {
      // We want terser to parse ecma 8 code. However, we don't want it
      // to apply any minification steps that turns valid ecma 5 code
      // into invalid ecma 5 code. This is why the 'compress' and 'output'
      // sections only apply transformations that are ecma 5 safe
      // https://github.com/facebook/create-react-app/pull/4234
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      // Disabled because of an issue with Uglify breaking seemingly valid code:
      // https://github.com/facebook/create-react-app/issues/2376
      // Pending further investigation:
      // https://github.com/mishoo/UglifyJS2/issues/2011
      comparisons: false,
      // Disabled because of an issue with Terser breaking valid code:
      // https://github.com/facebook/create-react-app/issues/5250
      // Pending further investigation:
      // https://github.com/terser-js/terser/issues/120
      inline: 2,
    },
    mangle: {
      safari10: true,
    },
    // Added for profiling in devtools
    keep_classnames: isEnvProductionProfile,
    keep_fnames: isEnvProductionProfile,
    output: {
      ecma: 5,
      comments: false,
      // Turned on because emoji and regex is not minified properly using default
      // https://github.com/facebook/create-react-app/issues/2488
      ascii_only: true,
    },
  },
  // Use multi-process parallel running to improve the build speed
  // Default number of concurrent runs: os.cpus().length - 1
  parallel: true,
  // Enable file caching
  cache: true,
  sourceMap: shouldUseSourceMap,
});

const configureOptimizeCSSAssetsPlugin = ({ shouldUseSourceMap }) => ({
  cssProcessorOptions: {
    // parser: safePostCssParser,
    map: shouldUseSourceMap
      ? {
        // `inline: false` forces the sourcemap to be output into a
        // separate file
        inline: false,
        // `annotation: true` appends the sourceMappingURL to the end of
        // the css file, helping the browser find the sourcemap
        annotation: true,
      }
      : false,
  },
  cssProcessorPluginOptions: {
    preset: ['default', { minifyFontValues: { removeQuotes: false } }],
  },
});

module.exports = (envState) => {
  const { isEnvTest, isEnvProduction } = envState;

  return {
    minimize: isEnvProduction,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin(
        configureTerserPlugin(envState),
      ),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin(
        configureOptimizeCSSAssetsPlugin(envState),
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
            const matches = module
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
          reuseExistingChunk: true,
        },
      },
    },

    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: !isEnvTest && {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  };
};
