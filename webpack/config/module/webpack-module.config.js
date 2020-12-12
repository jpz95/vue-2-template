const loaders = require('./_loaders');

module.exports = (envState) => {
  const { isEnvProduction, shouldUseSourceMap, imageInlineSizeLimit } = envState;

  return {
    strictExportPresence: true,
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      loaders.configureEslintLoader(),
      loaders.configureVueLoader(),
      {
        // "oneOf" will traverse all of the following loaders until one will match
        // the requirements. When no loader matches, it will fall back to the
        // "file" loader at the end of the loader list.
        oneOf: [
          loaders.configureImageLoader(imageInlineSizeLimit),
          loaders.configureMediaLoader(imageInlineSizeLimit),
          loaders.configureFontLoader(imageInlineSizeLimit),
          loaders.configureBabelLoader(),
          {
            test: /\.css$/,
            oneOf: [
              {
                resourceQuery: /module/,
                ...loaders.configureStyleLoader({
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
              loaders.configureStyleLoader({
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
                ...loaders.configureStyleLoader({
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
              loaders.configureStyleLoader({
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
                      prependData: '@import "~_variables.scss";',
                    },
                  },
                ],
                ...envState,
              }),
            ],
          },
          loaders.configureFallbackLoader(),
        ],
      },
    ],
  };
};
