const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const paths = require('../../utils/paths');
const getClientEnvironment = require('../../utils/env');
const webpackEnvModule = require('../../builder/webpack-env-module');

module.exports = () => {
  const isEnvProduction = webpackEnvModule.isEnvProduction();
  const isEnvDevelopment = webpackEnvModule.isEnvDevelopment();

  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.

  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  return [
    new VueLoaderPlugin(),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: paths.appHtml,
        },
        isEnvProduction ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          }
        : undefined
      )
    ),

    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV is set to production
    // during a production build.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),

    // This is necessary to emit hot updates (currently CSS only):
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

    new FriendlyErrorsWebpackPlugin(),

    isEnvProduction &&
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

    // Generate an asset manifest file with the following content:
    // - "files" key: Mapping of all asset filenames to their corresponding
    //   output file so that tools can pick it up without having to parse
    //   `index.html`
    // - "entrypoints" key: Array of files which are included in `index.html`,
    //   can be used to reconstruct the HTML if necessary
    // TODO uncomment if we can use plugin
    // new ManifestPlugin({
    //   fileName: 'asset-manifest.json',
    //   publicPath: publicPath,
    //   generate: (seed, files, entrypoints) => {
    //     const manifestFiles = files.reduce((manifest, file) => {
    //       manifest[file.name] = file.path;
    //       return manifest;
    //     }, seed);
    //     const entrypointFiles = entrypoints.main.filter(
    //       fileName => !fileName.endsWith('.map')
    //     );

    //     return {
    //       files: manifestFiles,
    //       entrypoints: entrypointFiles,
    //     };
    //   },
    // }),

    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ];
};
