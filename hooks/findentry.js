// Find entry module.
// Ng4 laravel module need to follow directory structure as below:
// ModuleName
//    |_ _ng
//        |_ depends.json
//
//
//This dependency check command will automaticlly install denpendency npm packages for it

var fs = require("fs");
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var stand = require('./stand.js');

var installed = {};

var output = execSync("find " + stand.root + " -type f -name 'package.json' | grep '_ng/package.json'");
var files = output.toString().split('\n');
for (var i = 0; i < files.length; i++) {
    if (files[i].length > 0) {
        try {
            var json = JSON.parse(fs.readFileSync(files[i], 'utf8'));
            if (json && json.appentry) {
                var module = stand.getModuleNameFromPath(files[i]);
                global.appentry = {
                    module: module,
                    details: json.appentry
                }
                break;
            }
        } catch (e) {
            console.log(stand.COLORS.FgRed, e);
        }
    }
}
if (global.appentry === undefined) {
    throw 'Can not find entry module!!!';
} else {
    console.log(stand.COLORS.FgCyan, 'Found entry module:')
    console.log(stand.COLORS.FgCyan, global.appentry);
}
console.log(stand.COLORS.Reset);