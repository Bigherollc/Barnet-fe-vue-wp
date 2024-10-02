const { src } = require('gulp');
const eslint = require('gulp-eslint');
const cached = require('gulp-cached');

const { filesJs } = require('../config/directories');
const { handleESLintError } = require('../utils/errors');
const stream = require('../utils/browser-sync');

function lintScripts () {
  let _gulp = src(filesJs)
    .pipe(eslint({
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

  if (stream.isStreaming) {
    return _gulp;
  }

  return _gulp
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

lintScripts.displayName = 'lint:scripts';

module.exports = lintScripts;
