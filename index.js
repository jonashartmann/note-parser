#!/usr/bin/env node

var Tokenizer = require('./tokenizer');
var Writer = require('./writer');
var colors = require('colors');

var     lazy    = require("lazy"),
        fs  = require("fs");


var parser = new Tokenizer();
var writer = new Writer(process.stdout);

new lazy(process.stdin)
    .lines
    .map(String)
    .map(parser.countLine.bind(parser))
    .map(parser.tokenize.bind(parser))
    .forEach(function (line) {
		var toBuf = parser.currentLine + ': ' +  line;
		writer.buffer(toBuf.replace(/[ \r\n]+$/g, '\n'));
    })
    .join(function (lines) {
		var tasks = parser.tasks;

		writer
			.writeLine(' ')
			.writeLine('==========================='.green);
		for (var task in tasks) {
			writer
				.write(task.green.bold)
				.write(' => ')
				.writeLine(colors.green.bold(tasks[task]));
		}
		writer
			.writeLine('==========================='.green)
			.writeLine()
			.flush();
    });
