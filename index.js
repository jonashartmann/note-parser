#!/usr/bin/env node

var fs      = require('fs');
var colors  = require('colors');
var lazy    = require('lazy');
var app     = require('commander');
var Parser  = require('./parser');
var Writer  = require('./writer');

function run (filename) {
    var color = app.color || 'green';
    var parser = new Parser();
    var writer = new Writer(process.stdout);
    var readStream = filename ?
        fs.createReadStream(filename) :
        process.stdin;

    new lazy(readStream)
        .lines
        .map(String)
        .map(parser.countLine.bind(parser))
        .map(parser.tokenize.bind(parser))
        .forEach(function (line) {
            var toBuf = parser.currentLine + ': ' +  line;
            if (parser.hasMention()) {
                toBuf = toBuf[color];
            }
            writer.buffer(toBuf.replace(/[ \r\n]+$/g, '\n'));
        })
        .join(function (lines) {
            var tasks = parser.tasks;

            writer
                .writeLine(' ')
                .writeLine('==========================='[color]);
            for (var task in tasks) {
                writer
                    .write(task[color].bold)
                    .write(' => ')
                    .writeLine(colors[color].bold(tasks[task]));
            }
            writer
                .writeLine('==========================='[color])
                .writeLine()
                .flush();
        });
}

var packageFile = fs.readFileSync('package.json');
var version = /(\d.\d.\d)+/.exec(packageFile)[0];

app
    .usage('[options] <filename>')
    .version(version)
    .option('-c, --color [color]', 'Color to use in the output')
    .on('--help', function() {
          console.log('  Examples:');
          console.log('');
          console.log('    $ noteparser notes.txt');
          console.log('    $ noteparser notes.txt > out.txt');
          console.log('');
    })
    .action(function (filename) {
        app.file = filename;
    });

// Hack the process name
process.argv[1] = 'noteparser';
app.parse(process.argv);
run(app.file);
