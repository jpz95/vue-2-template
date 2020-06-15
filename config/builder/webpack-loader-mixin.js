const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackEnvModule = require('./webpack-env-module');
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
  // TODO define SCSS options
  scss: true,
};

// common function to get style loaders
const getStyleLoaders = ({ cssLoaderOptions, preprocessors }) => {
  const {
    isEnvDevelopment,
    isEnvProduction,
    shouldUseSourceMap,
    shouldUseRelativeAssetPaths,
  } = webpackEnvModule;

  // Defines 'use' property for style loaders.
  const loaders = [
    isEnvDevelopment() && require.resolve('vue-style-loader'),
    isEnvProduction() && {
      loader: MiniCssExtractPlugin.loader,
      options: shouldUseRelativeAssetPaths()
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
        sourceMap: isEnvProduction() && shouldUseSourceMap(),
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
  configureBabelLoader() {
    // Process application JS with Babel.
    return {
      test: /\.(js|mjs)$/,
      include: paths.appSrc,
      use: {
        loader: 'babel-loader',
        options: {
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          // TODO update to babel 7, there might be a mismatch
          // GZip compression has barely any benefits, for either modes.
          // https://github.com/facebook/create-react-app/issues/6846
          // cacheCompression: false,
          // compact: isEnvProduction,
        },
      },
    };
  },

  // Process application Vue files.
  configureVueLoader() {
    return {
      test: /\.vue$/,
      loader: 'vue-loader',
    };
  },

  configureStyleLoader(args) {
    if (!(args.type in styleTypes)) {
      throw new TypeError('')
    }

    const styleLoaderOptions = styleTypes[args.type];
    return {
      ...styleLoaderOptions,
      use: getStyleLoaders(args),
    };
  },

  // "file" loader makes sure those assets get served by WebpackDevServer.
  // When you `import` and asset. you get its (virtual) filename.
  // In production, they would get copied to the `build` folder.
  // This loader doesn't use a "test" so it will catch all modules
  // That fall through the other loaders.
  configureFallbackLoader() {
    return {
      loader: require.resolve('file-loader'),
      // Exclude `js` files to keep "css" loader working as it injects
      // its runtime that would otherwise be processed through "file" loader.
      // Also exclude `html` and `json` extensions so they get processed
      // by webpack's internal loaders.
      exclude: [/\.(js|mjs|vue)$/, /\.html$/, /\.json$/],
      options: {
        name: 'static/media[name].[hash:8].[ext]',
      },
    }
  },

  // "url" loader works like "file" loader except that it embeds assets
  // smaller than specified limit in bytes as data URLs to avoid requests.
  configureImageLoader(imageInlineSizeLimit) {
    return {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.(svg)(\?.*)?$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: imageInlineSizeLimit,
        name: 'static/img/[name].[hash:8].[ext]',
      },
    };
  },
  // "url" loader works like "file" loader except that it embeds assets
  // smaller than specified limit in bytes as data URLs to avoid requests.
  configureMediaLoader(imageInlineSizeLimit) {
    return {
      test: [/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: imageInlineSizeLimit,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    };
  },
  // "url" loader works like "file" loader except that it embeds assets
  // smaller than specified limit in bytes as data URLs to avoid requests.
  configureFontLoader(imageInlineSizeLimit) {
    return {
      test: [/\.(woff2?|eot|ttf|otf)(\?.*)?$/i],
      loader: require.resolve('url-loader'),
      options: {
        limit: imageInlineSizeLimit,
        name: 'static/fonts/[name].[hash:8].[ext]',
      },
    };
  },
};
