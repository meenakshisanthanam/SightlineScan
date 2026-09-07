const { join } = require('path');

// Keep Chrome inside the project instead of the default ~/.cache, so it
// survives from build step to runtime on hosts that reset the home directory.
/** @type {import("puppeteer").Configuration} */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
