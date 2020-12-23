/**
 * Copyright (c) 2015-2020, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * facebook.license file in the licenses directory of this source tree.
 */

const path = require('path');
const fs = require('fs');

const getPublicUrlOrPath = require('./get-public-or-path');
const settings = require('../../webpack.settings');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// eslint-disable-next-line import/no-dynamic-require
const appPackageJson = require(resolveApp('package.json'));

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath({
  isEnvDevelopment: process.env.NODE_ENV === 'development',
  homepage: appPackageJson.homepage,
  publicUrl: process.env.PUBLIC_URL,
});

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'vue',
  'json',
  'css',
  'scss',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const validExtension = moduleFileExtensions
    .find((extension) => fs.existsSync(
      resolveFn(`${filePath}.${extension}`),
    ));

  if (validExtension) {
    return resolveFn(`${filePath}.${validExtension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(settings.buildFolder),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appEntry: resolveApp(settings.entry),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appJsConfig: resolveApp('jsconfig.json'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
