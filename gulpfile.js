const gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imageResize = require('gulp-image-resize'),
    imagemin = require('gulp-imagemin'),
    imageminJpegoptim = require('imagemin-jpegoptim'),
    inlineImages = require('gulp-inline-images'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    htmlmin = require('gulp-htmlmin'),
    rename = require("gulp-rename"),
    // notify = require('gulp-notify'),
    del = require('del');

function minifyHtml(stream) {
    return stream.pipe(replace(/(href="css\/[^."]+)(.css)/g, '$1.min$2'))
        .pipe(replace(/(src="js\/[^."]+)(.js)/g, '$1.min$2'))
        .pipe(htmlmin({
            minifyCSS: true,
            minifyJS: {
                mangle: false,
                compress: false
            },
            removeComments: true
        }))
        .pipe(replace(/(\s*\n){3,}/g, '\n\n'))
        .pipe(gulp.dest('dist/'))
}

let resizeImageTasks = [];

[100, 360, 720].forEach(function (size) {
    let resizeImageTask = 'resize_' + size;
    gulp.task(resizeImageTask, function () {
        return gulp.src('src/views/images/pizzeria.jpg', {
                base: 'src'
            })
            .pipe(imageResize({
                width: size,
                filter: 'Catrom'
            }))
            .pipe(imagemin({
                progressive: true,
                verbose: true
            }))
            .pipe(rename({
                suffix: '-' + size
            }))
            .pipe(gulp.dest('dist'))
    });
    resizeImageTasks.push(resizeImageTask);
});

gulp.task('resize-images', resizeImageTasks);

gulp.task('images', () =>
    gulp.src(['src/img/*.{png,jpg}', 'src/views/images/*.{png,jpg}', '!src/views/images/pizzeria.jpg'], {
        base: 'src'
    })
    .pipe(imagemin([
        imageminJpegoptim({
            max: 85,
            progressive: true
        }),
        imagemin.optipng()
    ], {
        verbose: true
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('styles', () =>
    gulp.src(['src/css/*.css', 'src/views/css/*.css'], {
        base: 'src'
    })
    .pipe(minifycss())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    // .pipe(notify({
    //     message: 'Styles task complete'
    // }))
);

gulp.task('scripts', () =>
    gulp.src(['src/js/*.js', 'src/views/js/*.js'], {
        base: 'src'
    })
    .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    // .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist'))
    // .pipe(notify({
    //     message: 'Scripts task complete'
    // }))
);

gulp.task('index', function () {
    let stream = gulp.src('src/index.html')
        .pipe(replace(/<link href="css\/style.css"[^>]*>/, function (s) {
            let style = fs.readFileSync('src/css/style.css', 'utf8');
            return '<style>\n' + style + '\n</style>';
        }));

    return minifyHtml(stream);
});

gulp.task('replace-min-files', function () {
    let stream = gulp.src(['src/*.html', 'src/views/*.html', '!src/index.html'], {
        base: 'src'
    });

    return minifyHtml(stream);
});


gulp.task('clean', function (cb) {
    del(['dist/**']).then(cb())
});

gulp.task('default', function () {
    gulp.start('index', 'replace-min-files', 'images', 'resize-images', 'styles', 'scripts');
});