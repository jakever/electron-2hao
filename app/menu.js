import {Menu, shell, dialog} from 'electron'
import checkUpdate from './update'
import path from 'path'
export default (app,main)=> {
    let menus = [
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    role: 'undo',
                    accelerator: 'CmdOrCtrl+Z'
                }, {
                    label: '重做',
                    role: 'redo',
                    accelerator: 'Shift+CmdOrCtrl+Z'
                }, {
                    type: 'separator'
                }, {
                    label: '剪切',
                    role: 'cut',
                    accelerator: 'CmdOrCtrl+X'
                }, {
                    label: '复制',
                    role: 'copy',
                    accelerator: 'CmdOrCtrl+C'
                }, {
                    label: '粘贴',
                    role: 'paste',
                    accelerator: 'CmdOrCtrl+V'
                }, {
                    label: '选择全部',
                    role: 'selectall',
                    accelerator: 'CmdOrCtrl+A'
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                {role: 'reload', label: '刷新', accelerator: 'CmdOrCtrl+R'},
                {role: 'zoomin', label: '放大', accelerator: 'CmdOrCtrl+Plus'},
                {role: 'zoomout', label: '缩小', accelerator: 'CmdOrCtrl+-'},
                {role: 'resetzoom', label: '实际大小', accelerator: 'CmdOrCtrl+0'},
                {role: 'togglefullscreen', label: '全屏'}
            ]
        },
        // {
        //      role: 'window',
        //      label: '窗口',
        //      submenu: [
        //          {role: 'minimize', label: '最小化'},
        //          {role: 'close', label: '关闭'}
        //      ]
        //  },
         {
             label: '帮助',
             submenu: [
                 {label: '帮助 2号人事部', click: function(menuItem, browserWindow,event){
                     shell.openExternal('https://2haohr.kf5.com/hc/')
                 }}
             ]
         }
    ];
    if (process.platform === 'darwin') {
         menus.unshift({
             label: app.getName(),
             submenu: [
                {role: 'about', label: '关于2号人事部'},
                {label: '检查更新', click: function(){
                    checkUpdate().then((data)=> {
                        // if(!data.has){ //没有更新
                        //      dialog.showMessageBox({
                        //          type: 'info',
                        //          title: '检查更新',
                        //          detail: '您已经安装了最新版本的2号人事部',
                        //          buttons: ['知道了'],
                        //          noLink: false,
                        //          defaultId: 0
                        //      })
                        // }
                    })
                }},
                {role: 'hide', label: '隐藏2号人事部', accelerator: 'CmdOrCtrl+H'},
                {role: 'hideothers', label: '隐藏其他', accelerator: 'Shift+CmdOrCtrl+H'},
                {role: 'unhide', label: '显示全部'},
                {role: 'quit', label: '退出', accelerator: 'CmdOrCtrl+Q'}
             ]
         })
     }else{
        menus.unshift({
            label: '2号人事部',
            submenu: [
            //    {role: 'about', label: '关于2号人事部'},
               {label: '检查更新', click: function(){
                   checkUpdate().then((data)=> {
                       if(!data.has){ //没有更新
                            dialog.showMessageBox({
                                type: 'info',
                                title: '检查更新',
                                detail: '您已经安装了最新版本的2号人事部',
                                buttons: ['知道了'],
                                noLink: false,
                                defaultId: 0,
                                icon: path.resolve(__dirname,'../build/icon.ico')
                            })
                       }
                   })
               }},
               {role: 'quit', label: '退出', accelerator: 'CmdOrCtrl+Q'}
            ]
        })
     }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
}
