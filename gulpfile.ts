import gulp = require('gulp');
import del = require('del');
import sourcemaps = require('gulp-sourcemaps');
import typescript = require('gulp-typescript');
import fs = require('fs');

gulp.task('compile', () => {
    let project = typescript.createProject('tsconfig.json');
    
    return project.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(project))
        .pipe(sourcemaps.write({sourceRoot: './src'}))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['compile', 'manifest', 'resources']);

gulp.task('default', ['build']);

gulp.task('watch', () => {
    gulp.watch("src/**/*", ['build']);
});

gulp.task('manifest', () => {
    return gulp.src('manifest.json')
        .pipe(gulp.dest('build'));
});

gulp.task('resources', () => {
    return gulp.src('resources/**/*')
        .pipe(gulp.dest('build/resources'));
});

gulp.task('clean', cb => del.sync(['build']));