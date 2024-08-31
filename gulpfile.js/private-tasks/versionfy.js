const { src, dest } = require('gulp');
const header = require('gulp-header');
const dayjs = require('dayjs');

const { outputScript, outputStyle } = require('../config/directories');

function versionfy() {
  return src([`${outputScript}/**/*.js`, `${outputStyle}/**/*.css`])
    .pipe(header(`/* version: ${dayjs().format('DD-MM-YYYY HH:mm:ss')} */`))
    .pipe(dest((file) => file.base));
}

versionfy.displayName = 'versionfy';

module.exports = versionfy;
