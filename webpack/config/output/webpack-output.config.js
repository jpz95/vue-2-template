const path = require('path');

const webpackEnvModule = require('../../builder/webpack-env-module');
const paths = require('../../utils/paths');
const appPackageJson = require(paths.appPackageJson);

module.exports = () => {
  const isEnvProduction = webpackEnvModule.isEnvProduction();
  const isEnvDevelopment = webpackEnvModule.isEnvDevelopment();

  return {
    // The build folder.
    path: isEnvProduction ? paths.appBuild : undefined,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: isEnvDevelopment,

    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js',
    // TODO: remove this when upgrading to webpack 5
    futureEmitAssets: true,

    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : isEnvDevelopment && 'static/js/[name].chunk.js',

    // Webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: paths.publicUrlOrPath,

    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: isEnvProduction
      ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
      : isEnvDevelopment &&
        (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),

    // Prevents conflicts when multiple Webpack runtimes (from different apps)
    // are used on the same page.
    jsonpFunction: `webpackJsonp${appPackageJson.name}`,

    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    globalObject: 'this',
  };
};
