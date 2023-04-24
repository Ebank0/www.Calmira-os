const {src, dest, watch, parallel, series} = require('gulp');

const fileInclude = require('gulp-file-include');

const autoprefixer = require('gulp-autoprefixer');

const clean =require('gulp-clean')

const scss = require('gulp-sass')(require('sass'));

const browserSync = require('browser-sync').create();





function browsersync(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

exports.browsersync = browsersync;

const html = () => {
    return src('app/html_main/index.html')
    .pipe(fileInclude())
    .pipe(dest('app/'))
    .pipe(browserSync.stream())
}
exports.html = html;


function styles() {
    return src('app/scss/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
    .pipe(autoprefixer({overrideBrowserlist: ['last 10 version']}))
}

exports.styles = styles;

const concat = require('gulp-concat'); 
const uglify = require('gulp-uglify-es').default;

function scripts() {
    return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream()) 
}
exports.scripts = scripts;

function watching() { 
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/index.html']).on('change', browserSync.reload);
    watch(['app/html_main/index.html']).on('change', html);
    watch(['app/html/*.html']).on('change', html);
}



exports.watching = watching;

exports.default = parallel(html, styles, scripts, browsersync, watching)


function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/index.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
} 

exports.build = series(cleanDist, building);

function cleanDist(){
    return src('dist')
    .pipe(clean())
}