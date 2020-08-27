module.exports = function printNewLine(numberOfNewLines = 1) {
  for (let i = 0; i < numberOfNewLines; i++) {
    // eslint-disable-next-line no-console
    console.log();
  }
};
