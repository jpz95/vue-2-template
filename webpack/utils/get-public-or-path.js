/**
 * Copyright (c) 2015-2020, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * facebook.license file in the licenses directory of this source tree.
 */

const { URL } = require('url');

/**
 * Returns a URL or a path with slash at the end
 * In production can be URL, abolute path, relative path
 * In development always will be an absolute path
 * In development can use `path` module functions for operations
 *
 * @param {boolean} isEnvDevelopment
 * @param {(string|undefined)} homepage a valid url or pathname
 * @param {(string|undefined)} publicUrl a valid url or pathname
 * @returns {string}
 */
function getPublicUrlOrPath({ isEnvDevelopment, homepage, publicUrl }) {
  const stubDomain = 'https://google.com';

  if (publicUrl) {
    // ensure last slash exists
    const sanitizedPublicUrl = publicUrl.endsWith('/')
      ? publicUrl
      : `${publicUrl}/`;

    // validate if `publicUrl` is a URL or path like
    // `stubDomain` is ignored if `publicUrl` contains a domain
    const validPublicUrl = new URL(sanitizedPublicUrl, stubDomain);

    if (!isEnvDevelopment) {
      // Some apps do not use client-side routing with pushState.
      // For these, "homepage" can be set to "." to enable relative asset paths.
      return sanitizedPublicUrl;
    }

    return sanitizedPublicUrl.startsWith('.')
      ? '/'
      : validPublicUrl.pathname;
  }

  if (homepage) {
    // strip last slash if exists
    const sanitizedHomepage = homepage.endsWith('/') ? homepage : `${homepage}/`;

    // validate if `homepage` is a URL or path like and use just pathname
    const validHomepagePathname = new URL(sanitizedHomepage, stubDomain).pathname;

    if (!isEnvDevelopment) {
      // Some apps do not use client-side routing with pushState.
      // For these, "homepage" can be set to "." to enable relative asset paths.
      return sanitizedHomepage.startsWith('.')
        ? sanitizedHomepage
        : validHomepagePathname;
    }

    return homepage.startsWith('.')
      ? '/'
      : validHomepagePathname;
  }

  return '/';
}

module.exports = getPublicUrlOrPath;
