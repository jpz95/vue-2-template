const modules = require('../utils/modules');
const paths = require('../utils/paths');

module.exports = () => ({
  // This allows you to set a fallback for where Webpack should look for modules.
  // We placed these paths second because we want `node_modules` to "win"
  // if there are any conflicts. This matches Node resolution mechanism.
  // https://github.com/facebook/create-react-app/issues/253
  modules: ['node_modules', paths.appNodeModules].concat(
    modules.additionalModulePaths || [],
  ),
  // These are the reasonable defaults supported by the Node ecosystem.
  extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
  alias: {
    // TODO move to settings as webpackAliases
    // Use ES5 distribution of Vue.js
    vue$: 'vue/dist/vue.esm.js',
    ...(modules.webpackAliases || {}),
  },
});
