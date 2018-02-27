import "babel-polyfill"
import {app, dialog, BrowserWindow} from 'electron'
import path from 'path'
import url from 'url'
import request from 'request'
import fs from 'fs' 
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
    mainWindow.loadURL('http://localhost:16001/login')
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
    //客户端对于下载文件重命名时，对于文件扩展名的处理会不那么友好，做如下处理
    mainWindow.webContents.session.on('will-download', (e, item) => {
        e.preventDefault()
        //获取文件的总大小
        const totalBytes = item.getTotalBytes();
        
        //设置文件的保存路径，此时默认弹出的 save dialog 将被覆盖
        const fileName = item.getFilename()
        const filePath = path.resolve(app.getPath('downloads'), item.getFilename())
        const fileUrl = item.getURL()
        const ext = path.parse(filePath).ext
        dialog.showSaveDialog({
            defaultPath: filePath,
            nameFieldLabel: fileName,
            filters: [
                { name: fileName, extensions: ext }
            ]
        }, fname => {
            if(fname){
                request.get({
                    uri: fileUrl,
                    encoding: 'binary'
                }, (error,reponse,data)=> {
                    let fp = path.resolve(app.getPath('downloads'), fname)
                    fs.writeFileSync(fp,data,'binary')
                })
            }
        });
    });
    tray = new mTray(app,mainWindow)
    menu(app,mainWindow)
    app.setLoginItemSettings({ //设置开启启动
        openAtLogin: true,
        openAsHidden: true
    })
}
