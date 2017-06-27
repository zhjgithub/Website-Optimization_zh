const gulp = require('gulp'),
    imageResize = require('gulp-image-resize'),
    imagemin = require('gulp-imagemin'),
    imageminJpegoptim = require('imagemin-jpegoptim'),
    inlineImages = require('gulp-inline-images'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    htmlmin = require('gulp-htmlmin'),
    rename = require("gulp-rename"),
    del = require('del');

gulp.task('images-responsive', () =>
    gulp.src('src/views/images/pizzeria.jpg', {
        base: 'src'
    })
    .pipe(imageResize({
        width: 100,
        filter: 'Catrom'
    }))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(rename(path => path.basename += "-small"))
    .pipe(gulp.dest('dist'))
    .pipe(imageResize({
        width: 360,
        filter: 'Catrom'
    }))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(rename(path => path.basename += "-middle"))
    .pipe(gulp.dest('dist'))
    .pipe(imageResize({
        width: 720,
        filter: 'Catrom'
    }))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(rename(path => path.basename += "-large"))
    .pipe(gulp.dest('dist'))
);

gulp.task('images', () =>
    gulp.src(['src/img/*.{png,jpg}', 'src/views/images/*.{png,jpg}', '!src/views/images/pizzeria.jpg'], {
        base: 'src'
    })
    .pipe(imagemin([
        imageminJpegoptim({
            max: 85,
            progressive: true
        }),
    ], {
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        verbose: true
    }))
    .pipe(gulp.dest('dist'))
)

gulp.task('html', () =>
    gulp.src('src/index.html')
    .pipe(replace(/<link href="css\/style.css"[^>]*>/, function (s) {
        var style = fs.readFileSync('src/css/style.css', 'utf8');
        return '<style>\n' + style + '\n</style>';
    }))
    .pipe(replace(/(views\/images\/pizzeria)(.jpg)/, '$1-small$2'))
    .pipe(inlineImages({
        selector: 'img[src]'
    }))
    .pipe(htmlmin({
        minifyCSS: true,
        minifyJS: {
            mangle: false,
            compress: false
        },
        removeComments: true
    }))
    .pipe(replace(/(\s*\r\n){3,}/g, '\r\n\r\n'))
    .pipe(gulp.dest('dist/'))
);

gulp.task('copy', () =>
    gulp.src(['src/**', '!src/index.html', '!src/img/*', '!src/views/images/*'], {
        base: 'src'
    })
    .pipe(gulp.dest('dist'))
)

gulp.task('clean', function (cb) {
    del(['dist/*']).then(cb())
})

gulp.task('default', ['clean'], function () {
    gulp.start('copy', 'html', 'images-responsive', 'images');
});