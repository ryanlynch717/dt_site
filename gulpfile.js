var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var rubySass    = require('gulp-ruby-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var jsonToSass  = require('gulp-json-to-sass');
var rm          = require( 'gulp-rm' );
var ghPages = require('gulp-gh-pages');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuildDev: '<span style="color: grey">Running:</span> $ jekyll development build',
    jekyllBuildProd: '<span style="color: grey">Running:</span> $ jekyll production build'
};

/**
 * Build the dev Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);

    return cp.spawn( jekyll , ['build', '--config', '_config_dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Build the production Jekyll Site
 */
gulp.task('jekyll-build-prod', function (done) {
    browserSync.notify(messages.jekyllBuildProd);
    // Uses the default _config.yml file to do the build
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'fonts', 'images', 'jekyll-build', 'js'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src(['_scss/main.scss'])
        .pipe(jsonToSass({
            jsonPath: '_data/variables.json',
            scssPath: '_scss/_variables.scss'
        }))
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});

gulp.task('js', function () {
    return gulp.src('js/**.*')
        .pipe(gulp.dest('_site/js'));
});


gulp.task('fonts', ['clean:fonts'], function () {
    return gulp.src('fonts/**.*')
        .pipe(gulp.dest('_site/fonts'));
});

gulp.task( 'clean:fonts', function() {
  return gulp.src('_site/fonts/**/*', { read: false })
    .pipe( rm() )
});


gulp.task('images', ['clean:images'], function () {
    return gulp.src('images/**.*')
        .pipe(gulp.dest('_site/images'));
});

gulp.task( 'clean:images', function() {
  return gulp.src('_site/images/**/*', { read: false })
    .pipe( rm() )
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_data/variables.json', '_scss/*.scss', '_scss/*.css'], ['sass']);
    gulp.watch([
        '*.html', '_layouts/*.html', '_posts/*', '_data/*.json', '_includes/**/*',
        'js/**.*',
        'images/**.*',
        'fonts/**.*'
    ], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('deploy', ['jekyll-build-prod'], function() {
    return gulp.src("./_site/**/*")
    .pipe(ghPages());
});