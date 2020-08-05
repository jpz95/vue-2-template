const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackEnvModule = require('../../builder/webpack-env-module');

const styleTypes = {
  css: {
    test: /\.css$/,
    exclude: /\.module\.css$/,
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  },
  cssModules: {
    test: /\.css$/,
  },
  // TODO define SCSS options
  scss: true,
};

// common function to get style loaders
const getStyleLoaders = ({ cssLoaderOptions, preprocessors }) => {
  const isEnvDevelopment = webpackEnvModule.isEnvDevelopment();
  const isEnvProduction = webpackEnvModule.isEnvProduction();
  const shouldUseSourceMap = webpackEnvModule.shouldUseSourceMap();
  const shouldUseRelativeAssetPaths = webpackEnvModule.shouldUseRelativeAssetPaths();

  // Defines 'use' property for style loaders.
  const loaders = [
    isEnvDevelopment && require.resolve('vue-style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: shouldUseRelativeAssetPaths
        ? { publicPath: '../../' }
        : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssLoaderOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);

  if (preprocessors && preprocessors.length > 0) {
    // TODO verify its importance.
    // Handles url() calls for SCSS
    // loaders.push({
    //   loader: require.resolve('resolve-url-loader'),
    //   options: {
    //     sourceMap: isEnvProduction && shouldUseSourceMap,
    //   },
    // });

    preprocessors.forEach(({ name, options }) => {
      loaders.push(
        {
          loader: require.resolve(name),
          options: Object.assign(
            {},
            {
              sourceMap: true,
            },
            options,
          ),
        },
      );
    });
  }
  return loaders;
};

module.exports = {
  styleTypes,
  getStyleLoaders,
};