//prepare ng4 project's dependency
//Ng4 laravel module need to follow directory structure as below:
//ModuleName
//    |_ _ng
//        |_ assembly.ts
//
//
//This assemble command will automaticlly merge all module configurations for the whole project

var fs = require("fs");
var exec = require('child_process').execSync;
var stand = require('./stand.js');


console.log(stand.COLORS.FgMagenta, 'Start Assembling Modules.');

function checkAssembly(filename) {
    var filestring = fs.readFileSync(filename);
    var hasRootRoutes = (filestring.indexOf(' ROOTROUTES') > 0);
    var hasChildRoutes = (filestring.indexOf(' CHILDROUTES') > 0);
    var hasNotFoundRoutes = (filestring.indexOf(' NOTFOUNDROUTES') > 0);
    var hasMenus = (filestring.indexOf(' MENUS') > 0);
    var hasProvider = (filestring.indexOf(' PROVIDERS') > 0);

    return [
        hasRootRoutes ? 'ROOTROUTES' : '',
        hasChildRoutes ? 'CHILDROUTES' : '',
        hasNotFoundRoutes ? 'NOTFOUNDROUTES' : '',
        hasMenus ? 'MENUS' : '',
        hasProvider ? 'PROVIDERS' : '',
    ];
}

var output = exec("find " + stand.root + " -type f -name 'assembly.ts' | grep '_ng/assembly.ts'");
var files = output.toString().split('\n');
var imports = [];
var assembly_rootRoutes = [];
var assembly_notfoundRoutes = [];
var assembly_childRoutes = [];
var assembly_menus = [];
var assembly_providers = [];

imports.push("");

for (var i = 0; i < files.length; i++) {
    if (files[i].length > 0) {
        var moduleName = stand.getModuleNameFromPath(files[i]);

        console.log(stand.COLORS.FgGreen, '  assemble module ' + moduleName);

        var flags = checkAssembly(files[i]);
        for (var j = 0; j < flags.length; j++) {
            if (flags[j] != '') {
                var assembleName = moduleName + flags[j];
                var lines = ['import { ', flags[j], ' as ', assembleName, ' } from "', moduleName, '/assembly";'];
                imports.push(lines.join(''));

                switch (flags[j]) {
                    case 'ROOTROUTES':
                        assembly_rootRoutes.push('RouterModule.forRoot(' + assembleName + ')');
                        break;
                    case 'CHILDROUTES':
                        assembly_childRoutes.push('RouterModule.forChild(' + assembleName + ')');
                        break;
                    case 'NOTFOUNDROUTES':
                        assembly_notfoundRoutes.push('RouterModule.forRoot(' + assembleName + ')');
                        break;
                    case 'MENUS':
                        assembly_menus.push(assembleName);
                        break;
                    case 'PROVIDERS':
                        assembly_providers.push(assembleName);
                        break;
                }
            }
        }
    }
}


imports.push('');
// if (global.appentry) {
//     if (global.appentry.details.name === undefined || global.appentry.details.name === 'AppModule') {
//         imports.push("export { AppModule } from '" + global.appentry.module + "/" + global.appentry.details.file + "';");
//     } else {
//         imports.push("import{ " + global.appentry.details.name + " } from '" + global.appentry.module + "/" + global.appentry.details.file + "';");
//         imports.push("export class AppModule extends " + global.appentry.details.name + "{}");
//     }
// }
// imports.push('');

var exports = [];
if (assembly_notfoundRoutes.length == 0) {
    //use default notfound Routes
    var lines = ['export const NOTFOUNDROUTES: Routes = [', "{ path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },", "{ path: '**', redirectTo: 'not-found' }", "];"];
    imports.push(lines.join('\n'));
    imports.push('');
    assembly_notfoundRoutes.push('RouterModule.forRoot(NOTFOUNDROUTES)');
}

assembly_rootRoutes = assembly_rootRoutes.concat(assembly_notfoundRoutes);

if (assembly_rootRoutes.length > 0) {
    exports.push('');
    var lines = ['export const ROOTROUTES_DEFINES = [', assembly_rootRoutes.join(','), '];'];
    exports.push(lines.join(' '));
}
// if (assembly_childRoutes.length > 0) {
exports.push('');
var lines = ['export const CHILDROUTES_DEFINES = [', assembly_childRoutes.join(','), '];'];
exports.push(lines.join(' '));
// }
// if (assembly_menus.length > 0) {
exports.push('');
var lines = ['export const MENUS_DEFINES = [', assembly_menus.join(','), '];'];
exports.push(lines.join(' '));
// }
exports.push('');
var lines = ['export const PROVIDERS_DEFINES = [', assembly_providers.join(','), '];'];
exports.push(lines.join(' '));

var header = imports.join('\n');
var content = fs.readFileSync(process.cwd() + '/hooks/assemble.ts.template') + header + exports.join('\n');

fs.writeFileSync(stand.path(stand.suit + "/src/app/entry/assemble.ts"), content);

console.log(stand.COLORS.FgMagenta, 'Modules Assembled.\n');
console.log(stand.COLORS.Reset);