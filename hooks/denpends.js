//prepare ng project's dependency
//Ng4 laravel module need to follow directory structure as below:
//ModuleName
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

exec("npm list --depth=0 | awk '{print $2}'", function(error, stdout, stderr) {
    console.log(stand.COLORS.FgMagenta, 'Start package dependency check');

    var lines = stdout.toString().split('\n');
    var packages = {};
    for (var i = 1; i < lines.length; i++) {
        if (lines[i].length > 0) {
            var splits = lines[i].split('@');
            if (splits.length == 3) {
                packages['@' + splits[1]] = splits[2];
            } else {
                packages[splits[0]] = splits[1];
            }
        }
    }

    var output = execSync("find " + stand.root + " -type f -name 'package.json' | grep '_ng/package.json'");
    var files = output.toString().split('\n');
    for (var i = 0; i < files.length; i++) {
        if (files[i].length > 0) {
            try {
                var json = JSON.parse(fs.readFileSync(files[i], 'utf8'));
                if (json && json.dependencies) {
                    json = json.dependencies;
                }
                if (json) {
                    for (var prop in json) {
                        var ver = '' + json[prop];
                        ver = ver.replace('^', '');

                        if (installed[prop] === undefined) {
                            installed[prop] = ver;
                        } else {
                            if (installed[prop] == ver) {
                                continue;
                            }
                            if (installed[prop] > ver) {
                                var msg = stand.getModuleNameFromPath(files[i]) + " " + installed[prop] + " require lower version " + ver + " current(" + installed[prop] + ")"
                                console.log(stand.COLORS.FgRed, msg)
                                continue;
                            }
                        }

                        if (packages[prop] === undefined ||
                            packages[prop] === 'undefined' ||
                            packages[prop] < ver) {
                            var installer = "npm install --save " + prop + "@" + json[prop];
                            console.log(stand.COLORS.FgYellow, installer);
                            exec(installer, function(error, stdout, stderr) {
                                console.log(stand.COLORS.FgWhite, stdout);
                                console.log(stand.COLORS.FgRed, stderr);
                            });
                        }
                        console.log(stand.COLORS.FgGreen, '  ' + prop + "@" + json[prop] + ' ready.');
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    console.log(stand.COLORS.FgMagenta, 'Package dependency check finished.');
    console.log(stand.COLORS.Reset);
});