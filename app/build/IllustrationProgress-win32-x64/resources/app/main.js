const electron = require('electron')
const storage = require('electron-json-storage')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray
const os = require('os')
const autoUpdater = electron.autoUpdater
const dialog = electron.dialog
const version = app.getVersion()
const platform = os.platform() + '_' + os.arch()
const updaterFeedURL = 'https://illustration-progress.herokuapp.com/update/' + platform + '/' + version

let mainWindow = null

function appUpdater() {

    autoUpdater.setFeedURL(updaterFeedURL)
    autoUpdater.on('error', err => console.log(err))
    autoUpdater.on('checking-for-update', () => console.log('checking-for-update'))
    autoUpdater.on('update-available', () => console.log('update-available'))
    autoUpdater.on('update-not-available', () => console.log('update-not-available'))
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        let message = app.getName() + ' ' + releaseName
        if (releaseNotes) {
            const splitNotes = releaseNotes.split(/[^\r]\n/)
            message += '\n\nリリース内容:\n'
            splitNotes.forEach(notes => {
                message += notes + '\n\n'
            })
        }
        dialog.showMessageBox({
            type: 'question',
            buttons: ['再起動', 'あとで'],
            defaultId: 0,
            message: '新しいバージョンをダウンロードしました。再起動しますか？',
            detail: message
        }, response => {
            if (response === 0) {
                setTimeout(() => autoUpdater.quitAndInstall(), 1)
            }
        })
    })
    autoUpdater.checkForUpdates()

}
exports = module.exports = {
    appUpdater
}

storage.get('config', function (error, data) {
    if (error) throw error

    if (Object.keys(data).length === 0) {
        var json = {
            software: "1",
            version: "1",
            icon: "1"
        }
        storage.set('config', json, function (error) {
            if (error) throw error
        })
        createClient(json.software)
    } else {
        console.log('availableConfig')
        s = data
        mainWindow.webContents.send('settings', s)
        createClient(s.software)
    }
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('ready', function () {
    appUpdater()
    timestamp = Date.now()
    tray = new Tray(__dirname + '/lib/assets/soft_icon.png')
    const contextMenu = Menu.buildFromTemplate([
        { label: '再起動', click: function () { app.relaunch(); app.quit() } },
        { label: '終了', click: function () { app.quit() } }
    ])
    tray.setToolTip('IllustrationProgress ver.1.0.0')
    tray.setContextMenu(contextMenu)

    mainWindow = new BrowserWindow({ width: 800, height: 600, show: false })
    mainWindow.loadURL('file://' + __dirname + '/lib/index.html')

    Menu.setApplicationMenu(null)

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', function () {
        mainWindow = null
    })
})

ipc.on('settingsData', (event, arg) => {
    var json = {
        software: arg.software,
        version: arg.version,
        icon: arg.icon
    }
    storage.set('config', json, function (error) {
        if (error) throw error
    })
    createClient(arg.software)
    console.log('data receive ok')
})

ipc.on('updateStatus', (event, arg) => {
    updateClient(arg)
    console.log('update receive ok')
})

function software(s, v) {
    switch(s) {
        case "1":
            if(v == 1) {
                return "CLIP STUDIO PAINT PRO"
            }
            if(v == 2) {
                return "CLIP STUDIO PAINT EX"
            }
            if(v == 3) {
                return "CLIP STUDIO PAINT DEBUT"
            }
        
        case "2":
            return "Photoshop CC"

        case "3":
            return "ペイントツールSAI"

        case "4":
            return "MediBangPaint"

        case "5":
            return "FireAlpaca"
    }
}

function set_icon(n) {
    if(n == "1") {
        return "main_icon"
    } else {
        return "main_icon_custom"
    }
}

function returnID(n) {
    var i = ["558932393315139604","558950437470863360","558956093750116362","558958092570591233","558959218917507073"]
    return i[n - 1]
}

function createClient(id) {
    client = require('discord-rich-presence')(returnID(id))
}

function updateClient(d) {
    console.log('ok')
    client.updatePresence({
        state: '工程: ' + d.state,
        details: '"' + d.name + '"を描いています！',
        startTimestamp: timestamp,
        largeImageKey: set_icon(s.icon),
        largeImageText: software(s.software, s.version),
        smallImageKey: 'soft_icon',
        smallImageText: 'IllustrationProgress ver.1.0.0',
        instance: true,
    })
}