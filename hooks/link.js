//prepare _ng project's sub modules to src/app
//To use ngsuit you need to create an entry module and it's name as _ngApp
//And all these modules should be located as same directory level with ngsuit
//Here's the classic directory tree:
//src
//  |___ ngsuit
//  |          |_ src
//  |               |_ app
//  |___ NgApp
//  |          |_ _ng
//  |               |_ depends.json
//  |___ ModuleName
//             |_ _ng
//                 |_ depends.json
//
//
//This command will automaticlly link other _ng modules to ngsuit, so ngsuit directory tree will become:
//src
//  |___ ngsuit
//  |          |_ src
//  |               |_ app
//  |                    |_ NgApp
//  |                    |_ ModuleName
//  |___ NgApp
//  |          |_ _ng
//  |               |_ depends.json
//  |___ ModuleName
//             |_ _ng
//                 |_ depends.json
//
//
// So tsc command can build the whole project

var fs = require("fs");
var exec = require('child_process').execSync;
var stand = require('./stand.js');

console.log(stand.COLORS.FgMagenta, 'Start link modules to src/app folder...');
//link
var output = exec("find " + stand.root + " -type d -maxdepth 1 -mindepth 1 | grep -v " + stand.suit)
var files = output.toString().split('\n');
for (var i = 0; i < files.length; i++) {
    if (files[i].length > 0) {
        try {
            var o = exec("find " + files[i] + " -type f -name '*.ts'");
            if (o.toString() != '') {
                var parts = files[i].split('/');
                var name = parts.pop();
                var link_name = stand.path(stand.suit + "/src/app/" + name);
                exec("ln -s " + files[i] + " " + link_name);
                console.log(stand.COLORS.FgGreen, '  link ' + files[i] + " as " + link_name)
            }
        } catch (e) {
            console.log(stand.COLORS.Red, e);
        }
    }
}
console.log(stand.COLORS.FgMagenta, 'All modules are linked to src/app folder.');
console.log(stand.COLORS.Reset, '');
