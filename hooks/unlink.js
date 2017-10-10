//prepare _ng project's sub modules to src/app
//To use ngsuit you need to create an entry module and it's name as _ngApp
//When using compiled _ng project, it will prebuild to do link command
//Here's the directory tree after build
//src
//  |___ ngsuit
//  |          |_ src
//  |               |_ app
//  |                    |_ NgApp
//  |                    |_ ModuleName
//  |___ _ngApp
//  |          |_ _ng
//  |               |_ depends.json
//  |___ ModuleName
//             |_ _ng
//                 |_ depends.json
//
//
//This command will automaticlly unlink other _ng modules to ngsuit, so ngsuit directory tree will become:
//
//src
//  |___ ngsuit
//  |          |_ src
//  |               |_ app
//  |___ _ngApp
//  |          |_ _ng
//  |               |_ depends.json
//  |___ ModuleName
//             |_ _ng
//                 |_ depends.json
//

var fs = require("fs");
var exec = require('child_process').execSync;
var stand = require('./stand.js');

console.log(stand.COLORS.FgMagenta, 'We need to unlink modules from src/app folder and relink them back(in case some modules removed)')

//unlink
try {
	var output = exec("find " + stand.path(stand.suit + "/src/app") + " -maxdepth 1 -mindepth 1 | grep -v 'app/entry'")
	output = output.toString();
	if (output != '') {
	    var files = output.toString().split('\n');
	    for (var i = 0; i < files.length; i++) {
		if (files[i].length > 0) {
		    try {
			exec("unlink " + files[i]);
			console.log(stand.COLORS.FgYellow, '  unlink module ' + files[i] + ' from src/app folder')
		    } catch (e) {
			console.log(e);
		    }
		}
	    }
	}
} catch(e) {
}
console.log(stand.COLORS.FgMagenta, 'unlink modules from src/app folder finished.');
console.log(stand.COLORS.Reset);
