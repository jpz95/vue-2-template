module.exports = {
  /*** webpack.entry ***/
  entry: 'src/index.js',

  /*** webpack.output ***/
  buildFolder: 'build',

  /*** webpack.optimization ***/
  chunkGroups: {
    // Creates a named vendor chunk, if its greater than 15kb.
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      name(module) {
        // get the name. E.g. node_modules/packageName/not/this/part.js
        // or node_modules/packageName
        const packageName =
          module
            .context
            .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

        // npm package names are URL-safe, but some servers
        // don't like @ symbols
        return `npm.${packageName.replace('@', '')}`;
      },
    },
    // Creates a generic vendors chunk (default group).
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      name: 'vendors',
    },
  },
};
