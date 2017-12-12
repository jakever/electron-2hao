//检查版本更新
import axios from 'axios'
import getJson from 'get-package-json-from-github'
import {app, dialog, shell} from 'electron'
import path from 'path'
const appVersion = app.getVersion() //当前版本号
let config = {
    type: 'info',
    title: '检查更新',
    detail: '您已经安装了最新版本的2号人事部',
    buttons: ['知道了'],
    noLink: false,
    defaultId: 0
}
export default ()=> {
    return Promise.resolve(axios.get('https://test.2haohr.com/update.json').then(function(response) {
    // return Promise.resolve(getJson('git+https://github.com/jakever/electron-2hao.git').then(data=> {
        let version = response.data.version;
        if(process.platform !== 'darwin'){
            config.icon = path.resolve(__dirname,'../build/icon.ico')
        }
        if(appVersion < version){ //有新版本
            config.buttons = ['暂不更新','去更新'];
            config.detail = '有新版本的2号人事部啦';
            config.defaultId = 1;
            dialog.showMessageBox(config, function(cancelId, f){
                if(cancelId){
                    shell.openExternal('https://2haohr.com/clients')
                }
            })
            return {checked: true, has: true}; //第一次打开检查更新，若有更新则提示
        }else{
            dialog.showMessageBox(config)
            return {checked: true, has: false}; //第一次打开检查更新，若没有更新则不提示
        }
    }).catch(function(e) {
        console.log(e);
    }))

    // return Promise.resolve(getJson('git+https://github.com/electron/electron.git').then(data=> {
    //     if(process.platform !== 'darwin'){
    //         config.icon = path.resolve(__dirname,'../build/icon.ico')
    //     }
    //     if(appVersion<data.version){ //有新版本
    //         config.buttons = ['暂不更新','去更新'];
    //         config.detail = '有新版本的2号人事部啦';
    //         config.defaultId = 1;
    //         dialog.showMessageBox(config, function(cancelId, f){
    //             if(cancelId){
    //                 shell.openExternal('https://www.2haohr.com/client.html')
    //             }
    //         })
    //     }else{
    //         dialog.showMessageBox(config, function(cancelId, f){
    //             console.log(cancelId)
    //         })
    //     }
    //     return true
    // }).catch((err)=> {
    //     console.log(err)
    // }))
}