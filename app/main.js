import "babel-polyfill"
import { app, dialog, BrowserWindow, session } from 'electron'
import path from 'path'
import url from 'url'
import request from 'request'
import fs from 'fs' 
import mTray from './tray'
import menu from './menu'
// import checkUpdate from './update'

let mainWindow
let tray = null
// let checked = false

console.log(process.versions.chrome, '999~~~');

app.on('ready', createWindow)
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
app.on('window-all-closed', function(e) {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});

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
    mainWindow.loadURL('https://2haohr.com')
    // mainWindow.loadURL(url.format({
    //     pathname: path.resolve('file://', __dirname, '../app/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))

    mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
        event.preventDefault()
        
        Object.assign(options, {
            modal: false,
            parent: mainWindow,
            width: 1366,
            height: 800
        })
        event.newGuest = new BrowserWindow(options)
    })

    // mainWindow.on('close', function (e) {
    //     e.preventDefault()  // 阻止关闭
    // })
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
        //获取文件的总大小
        const totalBytes = item.getTotalBytes();
        //设置文件的保存路径，此时默认弹出的 save dialog 将被覆盖
        const fileName = item.getFilename()
        const filePath = path.resolve(app.getPath('downloads'), item.getFilename())
        const fileUrl = item.getURL()
        const ext = path.parse(filePath).ext
        if(ext != '.png' && ext != '.pdf'){ //图片、PDF下载还是使用原生浏览器的下载方式
            e.preventDefault()
            dialog.showSaveDialog({
                defaultPath: filePath,
                nameFieldLabel: fileName,
                filters: [
                    { name: fileName, extensions: ext.substr(1) }
                ]
            }, fname => {
                if(fname){
                    request.get({
                        uri: fileUrl,
                        encoding: 'binary'
                    }, (error,reponse,data)=> {
                        let fp = path.resolve(app.getPath('downloads'), fname)
                        let s = path.parse(fp).ext
                        if(!s){
                            fp += ext
                        }
                        fs.writeFileSync(fp,data,'binary')
                    })
                }
            });
        }
    });
    tray = new mTray(app,mainWindow)
    menu(app, mainWindow)
    // app.setLoginItemSettings({ //设置开启启动
    //     openAtLogin: true,
    //     openAsHidden: true
    // })
}
