'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const fractal = require('@frctl/fractal').create();
const logger = fractal.cli.console;
const hbs = require('@frctl/handlebars')({
    helpers: {
        times: function( n, block ) {
            var accum = '',
                i = -1;
            while( ++i < n ) {
                accum += block.fn( i );
            }
            return accum;
        }
    }
});
const paths = {
    src: `${__dirname}/src`,
    modules: `${__dirname}/src/components`,
    public: `${__dirname}/public`
};

const modules = [
    `${paths.public}/scripts/app.js`,
    `${paths.modules}/02-patterns/carousel/carousel.js`
];

const libs = [
    `${paths.public}/scripts/libs/flickity.pkgd.min.js`
];

fractal.set('project.title', 'Pattern library');
fractal.docs.set('path', `${__dirname}/src/docs`);
fractal.web.set('builder.dest', 'build');
fractal.web.set('static.path', __dirname + '/public');
fractal.components.set('path', `${__dirname}/src/components`);
fractal.components.set('default.preview', '@default');
fractal.components.engine(hbs);

gulp.task('fractal:start', function(){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});

gulp.task('fractal:build', function(){
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
        logger.success('Fractal build completed!');
    });
});

gulp.task('sass', function () {
    return gulp.src(`${__dirname}/public/styles/**/*.scss`)
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [
                `${paths.modules}/**/`,
                `${__dirname}/node_modules/bootstrap-sass/assets/stylesheets/`,
                `${__dirname}/node_modules/bourbon/app/assets/stylesheets`
            ]
        }).on('error', sass.logError))
        .pipe(gulp.dest(`${__dirname}/public/styles/`));
});

gulp.task('scripts:modules', function() {
    return gulp.src(modules)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(`${paths.public}/scripts/`));
});

gulp.task('scripts:libs', function() {
    return gulp.src(libs)
        .pipe(concat('libs.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(`${paths.public}/scripts/`));
});

gulp.task('watch', function () {
    gulp.watch(`${__dirname}/**/*.scss`, ['sass']);
    gulp.watch(`${paths.modules}/**/*.js`, ['scripts:modules']);
});

gulp.task('default', ['scripts:modules', 'scripts:libs', 'sass', 'watch', 'fractal:start']);
// gulp.task('default', ['sass', 'watch', 'fractal:start']);