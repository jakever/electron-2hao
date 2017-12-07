const shell = require('shelljs')

shell.exec('npm run build:win')
// if (process.platform !== 'linux') {
//     shell.exec('npm run build:win')
// }