const loaders = require('./_loaders');
const webpackEnvModule = require('../../builder/webpack-env-module');

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

module.exports = () => {
  const isEnvProduction = webpackEnvModule.isEnvProduction();
  const shouldUseSourceMap = webpackEnvModule.shouldUseSourceMap();

  return {
    strictExportPresence: true,
    rules: [
      // { eslint }
      loaders.configureVueLoader(),
      {
        // "oneOf" will travers all of the following loaders until one will match
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
                }),
              },
              loaders.configureStyleLoader({
                type: 'css',
                cssLoaderOptions: {
                  importLoaders: 1,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
              }),
            ],
          },
          loaders.configureFallbackLoader(),
        ],
      },
    ],
  };
};
