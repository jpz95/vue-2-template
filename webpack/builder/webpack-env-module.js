const paths = require('../utils/paths');

let _env = 'production';

module.exports = {
  setEnv(webpackEnv) {
    _env = webpackEnv;
  },
  isEnvDevelopment() {
    return _env === 'development';
  },
  isEnvProduction() {
    return _env === 'production';
  },
  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // In development, we always serve from the root. This makes config easier.
  getPublicPath() {
    return this.isEnvProduction()
      ? paths.servedPath
      : this.isEnvDevelopment() && '/';
  },
  shouldUseSourceMap() {
    // Source maps are resource heavy and can cause out of memory issue for large source files.
    return process.env.GENERATE_SOURCEMAP !== 'false';
  },
  shouldUseRelativeAssetPaths() {
    return this.getPublicPath() === './';
  },
};
