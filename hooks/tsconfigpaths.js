//prepare _ng project's modules to tsconfig.json paths node
//Ng4 laravel module need to follow directory structure as below:
//ModuleName
//    |_ _ng
//
//
//This tsconfig path command will automaticlly export module names to paths, 
//so we don't need to use real long relative path to import a module
//And we can import module like this:
// import { module } from 'ModualName/file'

var fs = require("fs");
var exec = require('child_process').execSync;
var stand = require('./stand.js');

console.log(stand.COLORS.FgMagenta, 'Put module alias into tsconfig.json ...')

var tsconfigFile = stand.path(stand.suit + "/tsconfig.json");
var tsconfig = JSON.parse(fs.readFileSync(tsconfigFile), 'utf8');

var output = exec("find " + stand.root + " -type d -maxdepth 2 -mindepth 2 | grep _ng | grep -v " + stand.suit)
var files = output.toString().split('\n');

if (tsconfig.compilerOptions['paths'] === undefined) {
    tsconfig.compilerOptions['paths'] = {};
}

tsconfig.compilerOptions.paths['@appassemble'] = ['app/entry/assemble'];

for (var i = 0; i < files.length; i++) {
    if (files[i].length > 0) {
        var config = stand.exportModulePath(files[i]);
        if (config) {
            tsconfig.compilerOptions.paths[config.module] = config.path;
            console.log(stand.COLORS.FgGreen, '  alias ' + config.module + '  ==> ' + config.path);
        }
    }
}

var json = JSON.stringify(tsconfig, null, 2);
fs.writeFileSync(tsconfigFile, json);
console.log(stand.COLORS.FgMagenta, 'Module alias finished.\n')
console.log(stand.COLORS.Reset)