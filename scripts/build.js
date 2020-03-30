// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require("../config/paths");

// load "production" config
const config = configFactory("production");
// empty build folder
fs.emptyDirSync(paths.appBuild);
// copy public folder into build folder
copyPublicFolder();

// feed config into webpack
build().then((result) => {
  console.log("we did it!", result.testMessage);

}).catch((err) => {
  if (err && err.message) {
    console.log(err.message);
  }
  process.exit(1);
});

function build() {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;

      if (err) {
        if (!err.message) {
          return reject({ message: err });
        }

        // react build creates array of errors/warnings
        messages = {
          message: err.message,
          type: "error"
        };

      } else {

        // react build creates messages from 'stats'
        messages = {
          message: "yaya",
          type: "success"
        };
      }

      if (messages.type === "error") {
        // should check for number of errors and return first
        return reject(messages);
      }

      return resolve({
        stats,
        testMessage: messages.message,
        warnings: messages.warnings
      })
    })
  });
}


function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
