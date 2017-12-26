import "babel-polyfill"
import {app, BrowserWindow, BrowserView, autoUpdater} from 'electron'
import path from 'path'
import url from 'url'
import mTray from './tray'
import menu from './menu'
import checkUpdate from './update'

let mainWindow
let tray = null
let checked = false

// 自动更新
app.on('will-finish-launching', () => {

})
app.on('ready', createWindow)
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

// 创建主窗口
function createWindow() {
    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname,'../build/icon.png'),
        width: 1366,
        height: 800,
        // skipTaskbar: true,
        title: '2号人事部',
        webPreferences: {
            nativeWindowOpen: true,
            defaultFontSize: 14
        }
    })
    mainWindow.loadURL('https://2haohr.com/login')
    // mainWindow.loadURL(url.format({
    //     pathname: resolve('../app/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))

    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        const win = new BrowserWindow({
            show: false,
            width: 800,
            height: 600
        })
        win.once('ready-to-show', () => win.show())
        win.loadURL(url)
        event.newGuest = win
    })

    mainWindow.on('close', function (e) {
        // e.preventDefault()  // 阻止关闭
    })
    mainWindow.on('closed', function () {
        mainWindow = null
        tray.destroy();
    })
    // mainWindow.webContents.on('did-frame-finish-load', function() {
    //     if(!checked){ //仅首次加载需要自动检测更新
    //         checkUpdate().then((data)=>{
    //             if(data.checked){
    //                 checked = true
    //             }
    //         });
    //     }
    // });
    tray = new mTray(app,mainWindow)
    menu(app,mainWindow)
    app.setLoginItemSettings({ //设置开启启动
        openAtLogin: true,
        openAsHidden: true
    })
}
