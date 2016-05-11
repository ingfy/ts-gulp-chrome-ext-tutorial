/// <reference path="./custom-typings/gulp-zip.d.ts" />

import gulp = require('gulp');
import del = require('del');
import sourcemaps = require('gulp-sourcemaps');
import zip = require('gulp-zip');
import typescript = require('gulp-typescript');
import fs = require('fs');
import {Server as KarmaServer} from 'karma';
import { join } from 'path';
import concat = require('gulp-concat');

gulp.task('compile', () => {
    let project = typescript.createProject('tsconfig.json');
    
    return project.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(project))
        .pipe(sourcemaps.write({sourceRoot: './src'}))
        .pipe(gulp.dest('build/app'));
});

gulp.task('build', ['compile', 'manifest', 'resources', 'loader']);

gulp.task('default', ['build']);

gulp.task('zip', ['build'], () => {
    let manifest = JSON.parse(fs.readFileSync('build/manifest.json').toString());
    let packageName = `${manifest.name} v${manifest.version}`;
    let packageFileName = `${packageName}.zip`;
    
    return gulp.src('build/**/*')
        .pipe(zip(packageFileName))
        .pipe(gulp.dest('dist'));
});

function runKarma(singleRun: boolean, cb?: () => void) {    
    new KarmaServer({
        configFile: join(__dirname, './karma.conf.js'),
        singleRun: singleRun
    }, cb).start();
}

gulp.task('test', ['build'], cb => runKarma(true, cb));

gulp.task('test-watch', cb => runKarma(false, cb));
gulp.task('watch', () => {
    gulp.watch("src/**/*", ['build']);
    runKarma(false);
});



gulp.task('manifest', () => {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('loader', ['compile'], () => {
    return gulp.src(['node_modules/systemjs/dist/system.src.js', 'system.loader.js'])
        .pipe(concat('contentScript.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('resources', () => {
    return gulp.src('resources/**/*')
        .pipe(gulp.dest('build/resources'));
});

gulp.task('clean', cb => del.sync(['build']));