var winstaller = require('electron-winstaller');

winstaller.createWindowsInstaller({
    appDirectory: '../build/IllustrationProgress-win32-x64',
    outputDirectory: '../build/installer',
    authors: 'hideki_0403',
    exe: 'IllustrationProgress.exe',
    description: 'Discordに詳細を出せるソフト'
})
    .then(() => console.log('It worked!'))
    .catch(e => console.log(`No dice: ${e.message}`));
