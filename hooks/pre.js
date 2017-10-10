var LOGCOLOR = "\x1b[32m";

console.log(LOGCOLOR, 'Step 0. Find app entry:')
require('./findentry.js');

console.log(LOGCOLOR, 'Step 1. Unlink modules:')
require('./unlink.js');

console.log(LOGCOLOR, 'Step 2. Relink modules:')
require('./link.js');

console.log(LOGCOLOR, 'Step 3. Assemble modules:')
require('./assemble.js');

console.log(LOGCOLOR, 'Step 4. Alias modules:')
require('./tsconfigpaths.js');

console.log(LOGCOLOR, 'Step 5. Package depandency check:')
require('./denpends.js');