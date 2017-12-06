import {Tray, Menu} from 'electron';
import path from 'path'
class Mtray {
    constructor(app, main) {
        this.tray = new Tray(path.resolve(__dirname,'../build/icon.png'))
        if (process.platform !== 'darwin') { //windows右下角任务栏图标右键退出
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: '退出',
                    click: function () {
                        app.exit()
                    }
                }
            ])
            this.tray.setContextMenu(contextMenu)
        }
        this.tray.on('click',function(e){
            main.show();
        })
        this.tray.on('double-click',function(e){
            main.show();
        })
    }
    destroy(opt){
        this.tray.destroy();
    }
}
export default Mtray
