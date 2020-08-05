const configurator = require('../builder/webpack-configurator');
const webpackEnvModule = require('../builder/webpack-env-module');

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
      configurator.configureVueLoader(),
      {
        // "oneOf" will travers all of the following loaders until one will match
        // the requirements. When no loader matches, it will fall back to the
        // "file" loader at the end of the loader list.
        oneOf: [
          configurator.configureImageLoader(imageInlineSizeLimit),
          configurator.configureMediaLoader(imageInlineSizeLimit),
          configurator.configureFontLoader(imageInlineSizeLimit),
          configurator.configureBabelLoader(),
          {
            test: /\.css$/,
            oneOf: [
              {
                resourceQuery: /module/,
                ...configurator.configureStyleLoader({
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
              configurator.configureStyleLoader({
                type: 'css',
                cssLoaderOptions: {
                  importLoaders: 1,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
              }),
            ],
          },
          configurator.configureFallbackLoader(),
        ],
      },
    ],
  };
};
