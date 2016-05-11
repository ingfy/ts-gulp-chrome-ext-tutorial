let typescript = require('typescript');
let fs = require('fs');
let gulpfile = fs.readFileSync('./gulpfile.ts').toString();
eval(typescript.transpile(gulpfile));