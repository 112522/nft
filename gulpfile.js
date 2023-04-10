const { src, dest, watch, parallel, series } = require('gulp');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const clean = require('gulp-clean');

function scripts() {
  return src(['node_modules/swiper/swiper-bundle.js', 'app/js/*.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/*.scss')
    .pipe(
      autoprefixer(['last 10 versions'], {
        cascade: true,
      })
    )
    .pipe(concat('style.min.css'))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function watching() {
  watch('app/js/*.js', scripts);
  watch('app/scss/*.scss', styles);
  watch('app/*.html').on('change', browserSync.reload);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
}

function cleanDist() {
  return src('dist', { read: false }).pipe(clean());
}

function building() {
  return src(['app/css/style.min.css', 'app/js/main.min.js', 'app/*.html'], {
    base: 'app',
  }).pipe(dest('dist'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
exports.default = parallel(scripts, styles, watching, browsersync);
