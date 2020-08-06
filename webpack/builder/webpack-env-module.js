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
  // Variable used for enabling profiling in Production
  // passed into alias object. Uses a flag if passed into the build command
  isEnvProductionProfile() {
    return this.isEnvProduction() && process.argv.includes('--profile');
  },

  shouldUseSourceMap() {
    // Source maps are resource heavy and can cause out of memory issue for large source files.
    return process.env.GENERATE_SOURCEMAP !== 'false';
  },
};
