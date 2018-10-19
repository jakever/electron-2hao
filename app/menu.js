import { Menu, shell } from 'electron'
import checkUpdate from './update'
import AutoLaunch from 'auto-launch'
const appLauncher = new AutoLaunch({
    name: '2号人事部'
})

export default async (app, main)=> {
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
                {label: '刷新', role: 'reload', accelerator: 'CmdOrCtrl+R'},
                {label: '放大', role: 'zoomin', accelerator: 'CmdOrCtrl+Plus'},
                {label: '缩小', role: 'zoomout', accelerator: 'CmdOrCtrl+-'},
                {label: '实际大小', role: 'resetzoom', accelerator: 'CmdOrCtrl+0'},
                {label: '全屏', role: 'togglefullscreen'},
                {label: '状态栏', role: 'toggleTabBar'},
                {label: '开发者工具', role: 'toggleDevTools'}
            ]
        },
         {
             label: '帮助',
             submenu: [
                 {label: '帮助 2号人事部', click: function(menuItem, browserWindow,event){
                     shell.openExternal('https://2haohr.kf5.com/hc/')
                 }}
             ]
         }
    ];
    if (process.platform === 'darwin') { //mac
         menus.unshift({
             label: app.getName(),
             submenu: [
                {role: 'about', label: '关于2号人事部'},
                {label: '检查更新', click: function() {
                    checkUpdate()
                }},
                {role: 'hide', label: '隐藏2号人事部', accelerator: 'CmdOrCtrl+H'},
                {role: 'hideothers', label: '隐藏其他', accelerator: 'Shift+CmdOrCtrl+H'},
                {role: 'unhide', label: '显示全部'},
                {label: '开机启动', click: async function() {
                    let enabled = await appLauncher.isEnabled()
                    if(enabled) {
                        return appLauncher.disable()
                    } else {
                        return appLauncher.enable()
                    }
                }, 
                type: 'checkbox',
                checked: await appLauncher.isEnabled()
                },
                {role: 'quit', label: '退出', accelerator: 'Cmd+Q'}
             ]
         })
     }else{
        menus.unshift({
            label: '2号人事部',
            submenu: [
               {label: '检查更新', click: function(){
                   checkUpdate()
               }},
                {label: '开机启动', click: async function() {
                     let enabled = await appLauncher.isEnabled()
                     if(enabled) {
                         return appLauncher.disable()
                     } else {
                         return appLauncher.enable()
                     }
                 }, 
                 type: 'checkbox',
                 checked: await appLauncher.isEnabled()
                 },
               {role: 'quit', label: '退出', accelerator: 'Ctrl+Shift+Q'}
            ]
        })
     }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
}
