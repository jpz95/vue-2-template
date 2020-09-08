// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || '10000',
);

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvTest = webpackEnv === 'test';
  const isEnvProduction = webpackEnv === 'production';
  const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');

  return {
    shouldUseSourceMap,
    imageInlineSizeLimit,
    isEnvDevelopment,
    isEnvTest,
    isEnvProduction,
    isEnvProductionProfile,
  };
};
