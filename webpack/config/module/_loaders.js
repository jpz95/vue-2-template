const stylesUtil = require('./_styles-util');
const paths = require('../../utils/paths');

module.exports = {
  configureEslintLoader() {
    return {
      test: /\.(js|mjs|vue)$/,
      enforce: 'pre',
      use: [
        {
          options: {
            cache: true,
            eslintPath: require.resolve('eslint'),
            resolvePluginsRelativeTo: __dirname,
          },
          loader: require.resolve('eslint-loader'),
        },
      ],
      include: paths.appSrc,
    };
  },

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
    if (!(args.type in stylesUtil.styleTypes)) {
      throw new TypeError(`No style loader configuration for type ${args.type}`, args);
    }

    const styleLoaderOptions = stylesUtil.styleTypes[args.type];
    return {
      ...styleLoaderOptions,
      use: stylesUtil.getStyleLoaders(args),
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
        name: 'static/media/[name].[hash:8].[ext]',
      },
    };
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
