const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');


/* ------------- Server ---------- */

gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ----------- Pug complite --------*/

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('./source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

/* ----------- Styles complite --------*/

gulp.task('styles:compile', function() {
    return gulp.src('./source/styles/main.sass')
        .pipe(sass({outputeStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./build/css'));
});

/* ----------- Sprite complite --------*/

gulp.task('sprite', function(cd) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.sass'
    }));

    spriteData.img.pipe(gulp.dest('./build/images/'));
    spriteData.css.pipe(gulp.dest('./source/styles/global'));
    cd();
});

/* ---------- Clean (rimrtaf) ------------*/

gulp.task('clean', function del(cd) {
    return rimraf('build', cd);
});

/* ---------- Copy images ------------*/

gulp.task('copy:images', function() {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('./build/images'));
});

/* ---------- Copy fonts ------------*/

gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));
});

/* ---------- Copy ------------*/

gulp.task('copy', gulp.parallel('copy:images', 'copy:fonts'));

/* ----------- Soursemap --------*/

gulp.task('js', function() {
    return gulp.src([
            '/source/js/form.js',
            '/source/js/navigation.js',
            '/source/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});


/* ---------- Watchers ------------*/

gulp.task('watch', function() {
    gulp.watch('./source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('./source/styles/**/*.sass', gulp.series('styles:compile'));
    gulp.watch('./source/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'js', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);





