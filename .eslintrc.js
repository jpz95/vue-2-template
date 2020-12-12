module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    'plugin:mocha/recommended',
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  globals: {
    expect: true,
  },
  overrides: [
    {
      files: ['*.spec.js'],
      rules: {
        'func-names': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  ],
  plugins: [
    'vue',
    'mocha',
  ],
  rules: {
    quotes: ['error', 'single'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    radix: ['error', 'as-needed'],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
        extensions: ['.mjs', '.js', '.json', '.vue', '.css', '.scss'],
      },
    },
  },
};
