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

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import bs from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';


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
    .pipe($.size({title: 'images'}))
);

gulp.task('clearCache', () => {
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
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sass({
      precision: 10,
      includePaths: require('node-bourbon').includePaths
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))

    .pipe($.if('*.css', $.cssnano({
      discardUnused: false
    })))
    .pipe($.size({title: 'styles'}))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream());
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
var scriptsArray = [
  // Note: Since we are not using useref in the scripts build pipeline,
  //       you need to explicitly list your scripts here in the right order
  //       to be correctly concatenated

  // './app/scripts/slick.min.js',
  // './app/scripts/jquery.bPopup.js',
  // './app/scripts/chosen.jquery.js',
  // './app/scripts/jquery.fancybox.pack.js',
  // './app/scripts/jquery.dotdotdot.min.js',
  // './app/scripts/jquery.mCustomScrollbar.concat.min.js',
  // './app/scripts/stickytableheaders.min.js',
  // './app/scripts/jquery.tools.min.tabs.js',
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
    // Remove any unused CSS
    .pipe($.if('*.css', $.uncss({
      html: [
        'app/index.html'
      ],
      // CSS Selectors for UnCSS to ignore
      ignore: []
    })))

    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Clean images directory
gulp.task('cleanImages', ['images'], () => {
  del(['dist/images/sprite/**'], {dot: true})
});

// Watch files for changes & reload
gulp.task('serve', ['default'], () => {
  browserSync.init({
    notify: true,
    server: ['.tmp', 'dist'],
    reloadDelay: 500,
    port: 3000
  });

  gulp.watch(['app/**/*.html'], ['html', reload]);
  gulp.watch(['app/styles/**/*.scss'], ['styles']);
  gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['app/images/**/*.{jpg,png}', '!app/images/sprite/*'], ['cleanImages', reload]);
});

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    ['clearCache', 'sprite', 'html', 'scripts', 'cleanImages', 'styles', 'copy'],
    cb
  )
);


// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
