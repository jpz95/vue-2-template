const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('../utils/paths');

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
  scss: {
    test: /\.scss$/,
    exclude: /\.module\.scss$/,
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
  },
  scssModules: {
    test: /\.scss$/,
  },
};

// common function to get style loaders
const getStyleLoaders = ({
  cssLoaderOptions,
  preprocessors,
  isEnvDevelopment,
  isEnvProduction,
  shouldUseSourceMap,
}) => {
  // Defines 'use' property for style loaders.
  const loaders = [
    isEnvDevelopment && require.resolve('vue-style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith('.')
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
          // eslint-disable-next-line global-require
          require('postcss-flexbugs-fixes'),
          // eslint-disable-next-line global-require
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
          options: {
            sourceMap: true,
            ...options,
          },
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
