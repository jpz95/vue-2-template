const stylesUtil = require('./_styles-util');
const paths = require('../utils/paths');

const configureEslintLoader = () => ({
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
});

// Process application JS with Babel.
const configureBabelLoaderSrc = ({ isEnvProduction }) => ({
  test: /\.(js|mjs)$/,
  include: paths.appSrc,
  use: {
    loader: 'babel-loader',
    options: {
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      // GZip compression has barely any benefits, for either modes.
      // https://github.com/facebook/create-react-app/issues/6846
      cacheCompression: false,
      compact: isEnvProduction,
    },
  },
});

// Process any JS outside of the app with Babel.
// Unlike the application JS, we only compile the standard ES features.
const configureBabelLoaderDependencies = ({ shouldUseSourceMap }) => ({
  test: /\.(js|mjs)$/,
  exclude: /@babel(?:\/|\\{1,2})runtime/,
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve('babel-preset-react-app/dependencies'),
          { helpers: true },
        ],
      ],
      // This is a feature of `babel-loader` for webpack (not Babel itself).
      // It enables caching results in ./node_modules/.cache/babel-loader/
      // directory for faster rebuilds.
      cacheDirectory: true,
      // GZip compression has barely any benefits, for either modes.
      // https://github.com/facebook/create-react-app/issues/6846
      cacheCompression: false,
      // Babel sourcemaps are needed for debugging into node_modules
      // code.  Without the options below, debuggers like VSCode
      // show incorrect code and set breakpoints on the wrong lines.
      sourceMaps: shouldUseSourceMap,
      inputSourceMap: shouldUseSourceMap,
    },
  },
});

// Process application Vue files.
const configureVueLoader = () => ({
  test: /\.vue$/,
  loader: 'vue-loader',
});

const configureStyleLoader = (args) => {
  if (!(args.type in stylesUtil.styleTypes)) {
    throw new TypeError(`No style loader configuration for type ${args.type}`, args);
  }

  const styleLoaderOptions = stylesUtil.styleTypes[args.type];
  return {
    ...styleLoaderOptions,
    use: stylesUtil.getStyleLoaders(args),
  };
};

// "file" loader makes sure those assets get served by WebpackDevServer.
// When you `import` and asset. you get its (virtual) filename.
// In production, they would get copied to the `build` folder.
// This loader doesn't use a "test" so it will catch all modules
// That fall through the other
const configureFallbackLoader = () => ({
  loader: require.resolve('file-loader'),
  // Exclude `js` files to keep "css" loader working as it injects
  // its runtime that would otherwise be processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpack's internal
  exclude: [/\.(js|mjs|vue)$/, /\.html$/, /\.json$/],
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
});

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
const configureImageLoader = (imageInlineSizeLimit) => ({
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.(svg)(\?.*)?$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: imageInlineSizeLimit,
    name: 'static/img/[name].[hash:8].[ext]',
  },
});
// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
const configureMediaLoader = (imageInlineSizeLimit) => ({
  test: [/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: imageInlineSizeLimit,
    name: 'static/media/[name].[hash:8].[ext]',
  },
});
// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
const configureFontLoader = (imageInlineSizeLimit) => ({
  test: [/\.(woff2?|eot|ttf|otf)(\?.*)?$/i],
  loader: require.resolve('url-loader'),
  options: {
    limit: imageInlineSizeLimit,
    name: 'static/fonts/[name].[hash:8].[ext]',
  },
});

module.exports = (envState) => {
  const { isEnvProduction, shouldUseSourceMap, imageInlineSizeLimit } = envState;

  return {
    strictExportPresence: true,
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      configureEslintLoader(),
      configureVueLoader(),
      {
        // "oneOf" will traverse all of the following loaders until one will match
        // the requirements. When no loader matches, it will fall back to the
        // "file" loader at the end of the loader list.
        oneOf: [
          configureImageLoader(imageInlineSizeLimit),
          configureMediaLoader(imageInlineSizeLimit),
          configureFontLoader(imageInlineSizeLimit),
          configureBabelLoaderSrc(envState),
          configureBabelLoaderDependencies(envState),
          {
            test: /\.css$/,
            oneOf: [
              {
                resourceQuery: /module/,
                ...configureStyleLoader({
                  type: 'cssModules',
                  cssLoaderOptions: {
                    importLoaders: 1,
                    // enable CSS Modules
                    modules: {
                      localIdentName: isEnvProduction
                        ? '[hash:base64]'
                        : '[path][name]__[local]',
                    },
                    sourceMap: isEnvProduction && shouldUseSourceMap,
                  },
                  ...envState,
                }),
              },
              configureStyleLoader({
                type: 'css',
                cssLoaderOptions: {
                  importLoaders: 1,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
                ...envState,
              }),
            ],
          },
          {
            test: /\.scss$/,
            oneOf: [
              {
                resourceQuery: /module/,
                ...configureStyleLoader({
                  type: 'scssModules',
                  cssLoaderOptions: {
                    importLoaders: 3,
                    // enable CSS Modules
                    modules: {
                      localIdentName: isEnvProduction
                        ? '[hash:base64]'
                        : '[path][name]__[local]',
                    },
                    sourceMap: isEnvProduction && shouldUseSourceMap,
                  },
                  preprocessors: [
                    {
                      name: 'sass-loader',
                      options: {
                        // Prepends app variables to every SCSS file
                        prependData: '@import "~styles/i-variables/_index.scss";',
                      },
                    },
                  ],
                  ...envState,
                }),
              },
              configureStyleLoader({
                type: 'scss',
                cssLoaderOptions: {
                  importLoaders: 3,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
                preprocessors: [
                  {
                    name: 'sass-loader',
                    options: {
                      // Prepends app variables to every SCSS file
                      prependData: '@import "~styles/i-variables/_index.scss";',
                    },
                  },
                ],
                ...envState,
              }),
            ],
          },
          configureFallbackLoader(),
        ],
      },
    ],
  };
};
