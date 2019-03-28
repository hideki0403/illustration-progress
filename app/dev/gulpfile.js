var gulp = require("gulp");
var winInstaller = require('electron-windows-installer');
gulp.task('create_windows_installer', function (done) {
    winInstaller({
        appDirectory: '../build/IllustrationProgress-win32-x64',
        outputDirectory: '../build/installer',
        iconUrl: 'file://' + __dirname + '/soft_icon.png',
    }).then(done).catch(done);
});