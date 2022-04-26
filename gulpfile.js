const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const del = require("del");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const babel = require("gulp-babel");
const GulpUglify = require("gulp-uglify");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const autoPrefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const size = require("gulp-size");
const replace = require('gulp-replace');
const newer = require("gulp-newer");
const fileinclude = require("gulp-file-include");
const browserSync = require('browser-sync').create();

// Путь
const srcFolder = './src/';
const paths = {
    html: {
        src: "src/*.html",
        dest: "./dist/",
    },
    styles: {
        src: ["src/styles/style.scss"],
        dest: "dist/css/",
    },
    scripts: {
        src: "src/scripts/**/*.js",
        dest: "dist/js/",
    },
    images: {
        src: "src/img/**",
        dest: "dist/img",
    },
    watch: {
        html: `${srcFolder}**/*.html`,
        scripts: `${srcFolder}scripts/*.js`,
        styles: `${srcFolder}styles/*.scss`,
        images: `${srcFolder}img/**/*.{jpg,jpeg,png,gif,ico,webp}`,
    }
};

// Задача для обработки CSS
function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(replace(/@img\//g, '../img/'))
        .pipe(autoPrefixer({
            grid: true,
            overrideBrowserslist: ['last 3 versions'],
            cascade: true
        }))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(rename({
            basename: "styles",
            extname: ".min.css",
        }))
        .pipe(sourcemaps.write("."))
        .pipe(size({ showFiles: true }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

// Задача для обработки JS
function scripts() {
    return gulp.src(['src/scripts/scripts.js'])
        .pipe(sourcemaps.init())
        .pipe(fileinclude())
        .pipe(babel({
            presets: ["@babel/env"],
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(rename({
            basename: 'scripts',
            extname: ".js"
        }))
        .pipe(GulpUglify())
        .pipe(sourcemaps.write("."))
        .pipe(size({
            showFiles: true,
        }))
        .pipe(rename({
            basename: 'scripts',
            extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
}

function html() {
    return (
        gulp.src(paths.html.src)
            // .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(fileinclude())
            .pipe(replace(/@img\//g, './img/'))
            .pipe(size({
                showFiles: true,
            }))
            .pipe(gulp.dest(paths.html.dest))
            .pipe(browserSync.stream())
    );
}

// Задача для сжать фото(minify)
function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(imagemin())
        .pipe(
            size({
                showFiles: true,
            })
        )
        .pipe(gulp.dest(paths.images.dest));
}

// Watch for updateing
function watcher() {
    gulp.watch(paths.watch.html, html)
    gulp.watch(paths.watch.styles, styles)
    gulp.watch(paths.watch.scripts, scripts)
    gulp.watch(paths.watch.images, img)
}

// Browser sync
function server() {
    browserSync.init({
        server: {
            baseDir: `${paths.html.dest}`
        },
        notify: false,
        port: 3000
    })
}

function clean() {
    return del(["dist/*", "!dist/img"]);
}

const mainTask = gulp.parallel(html, styles, scripts, img)

const build = gulp.series(clean, mainTask, gulp.parallel(watcher, server));

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.watcher = watcher;
exports.build = build;
exports.default = build;
