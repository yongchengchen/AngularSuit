var exports = {
    COLORS: {
        Reset: "\x1b[0m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m"
    },

    suit: '',
    root: '',
    init: function() {
        var path = __filename.replace('/hooks/stand.js', '');
        var parts = path.split('/');
        this.suit = parts.pop();
        this.root = parts.join('/');
    },
    path: function(subpath) {
        return this.root + '/' + subpath;
    },
    getModuleNameFromPath: function(fileOfModule) {
        if (fileOfModule.length <= this.root.length) {
            return '';
        }

        var subpath = fileOfModule.substring(this.root.length + 1);
        var parts = subpath.split('/');
        return parts.shift();
    },

    relativeModulePath: function(fileOfModule) {
        var path = this.getModuleNameFromPath(fileOfModule);
        if (path.length < 1) {
            return '';
        } else {
            return '../../' + path + '/';
        }
    },

    exportModulePath: function(modulePath) {
        if (modulePath.length <= this.root.length) {
            return null;
        }

        var subpath = modulePath.substring(this.root.length + 1);
        var parts = subpath.split('/');
        var moduleName = parts.shift();
        moduleName = moduleName + '/*';
        var value = 'app/' + subpath + '/*';
        return { module: moduleName, path: [value] };
    }
}
exports.init();
module.exports = exports;
