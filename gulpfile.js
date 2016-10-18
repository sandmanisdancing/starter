/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const bs = require('browser-sync');
const gulpLoadPlugins = require('gulp-load-plugins');
const pkg = require('./package.json');

const $ = gulpLoadPlugins();
const browserSync = bs.create();
const reload = browserSync.reload;


// Optimize images
gulp.task('images', () =>
  gulp.src(['app/images/**/*', '!app/images/sprite/*'])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream())
    .pipe($.size({title: 'images'}))
);

// Convert images to WebP
gulp.task('webp', () => {
  return gulp.src(['app/images/**/*', '!app/images/sprite/*'])
    .pipe($.webp({
      quality: 85
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'webp'}));
});

// Clean cache
gulp.task('cleanCache', () => {
  return $.cache.clearAll();
});

// Sprite images
gulp.task('sprite', () => {
  var spriteData =
  gulp.src('app/images/sprite/*.*') // raw images for sprite path
  .pipe($.spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    cssFormat: 'scss',
    padding: 3,
    cssTemplate: 'scss.template.mustache',
    algorithm: 'binary-tree'
  }));

  spriteData.img.pipe(gulp.dest('app/images/')); // path for compiled sprite image
  spriteData.css.pipe(gulp.dest('app/styles/')); // path for compiled sprite variables
});

// Copy fonts to dist
gulp.task('fonts', () => {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Copy all files at the root level (app)
gulp.task('copy', ['fonts'], () =>
  gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  return gulp.src([
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sass({
      precision: 10,
      includePaths: require('node-bourbon').includePaths
    }).on('error', $.sass.logError))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('.tmp/styles'))

    .pipe($.if('*.css', $.cssnano({
      discardUnused: false
    })))
    .pipe($.autoprefixer({
      browsers: "last 4 versions"
    }))
    .pipe($.size({title: 'styles'}))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
var scriptsArray = [
  // Note: Since we are not using useref in the scripts build pipeline,
  //       you need to explicitly list your scripts here in the right order
  //       to be correctly concatenated

  './app/scripts/slick.min.js',
  // './app/scripts/jquery.bPopup.js',
  './app/scripts/chosen.jquery.js',
  // './app/scripts/jquery.fancybox.pack.js',
  // './app/scripts/jquery.dotdotdot.min.js',
  './app/scripts/jquery.mCustomScrollbar.concat.min.js',
  // './app/scripts/jquery.mousewheel.min.js',
  // './app/scripts/stickytableheaders.min.js',
  './app/scripts/jquery.chained.min.js',
  './app/scripts/jquery.tools.min.tabs.js',
  './app/scripts/jquery.masked.input.js',
  './app/scripts/modernizr-webp.js',
  './app/scripts/main.js'
];

gulp.task('scripts', () => {
    gulp.src(scriptsArray)
      .pipe($.concat('main.min.js'))
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
    }
);

gulp.task('scriptsProd', () => {
    gulp.src(scriptsArray)
      .pipe($.concat('main.min.js'))
      .pipe($.uglify({preserveComments: 'some'}))
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
    }
);

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe($.useref({searchPath: '{.tmp,app}'}))

    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Clean images directory
gulp.task('cleanImages', ['images', 'webp'], () => {
  del(['dist/images/sprite/**'], {dot: true})
});

// Watch files for changes & reload
gulp.task('serve', ['default'], () => {
  browserSync.init({
    notify: true,
    server: ['.tmp', 'dist'],
    reloadDelay: 800,
    port: 3000,
    ghostMode: false
  });

  gulp.watch(['app/**/*.html'], ['html', reload]);
  gulp.watch(['app/styles/**/*.scss'], ['styles']);
  gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['app/images/**/*.{jpg,png}', '!app/images/sprite/*'], ['cleanImages']);
});

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    ['cleanCache', 'sprite', 'html', 'scripts', 'cleanImages', 'styles', 'copy'],
    cb
  )
);
