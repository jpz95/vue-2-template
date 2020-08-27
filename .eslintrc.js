module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  plugins: [
    'vue',
  ],
  rules: {
    quotes: ['error', 'single'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    radix: ['error', 'as-needed'],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
        extensions: ['.mjs', '.js', '.json', '.vue'],
      },
    },
  },
};
