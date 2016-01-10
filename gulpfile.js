"use strict";
var gulp = require('gulp'),
  nodemon = require('nodemon'),
  shell = require('gulp-shell');


var FRONTEND_ROOT = 'frontend';


//rebuild
// gulp.task('rebuild', shell.task([
  // 'echo hello',
  // 'echo world'
// ]));

gulp.task('rebuild', shell.task([
  "cd frontend/ && npm run build"
]));

gulp.task('watch', function() {
  gulp.watch(FRONTEND_ROOT + '/src/**/*', ['rebuild']);
});

gulp.task('nodemon', function() {
  nodemon({
    exec: 'nodemon -L',
    script: './server/index.js',
    ignore: ['.git', 'node_modules', 'bower_components', '.sass-cache', FRONTEND_ROOT + '/**/*'],
    stdout: true
  });
});


gulp.task('default', ['watch', 'nodemon']);
