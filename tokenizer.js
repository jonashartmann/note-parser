var Tokenizer = function Tokenizer () {
	return {
		tokens: [],
		mentions: [],
		tasks: [],
		currentLine: 0,

		tokenize: function tokenize(line) {
			// makes sure that extra spaces are removed
			var words = line.split(/\s* \s*/);
			var tokens = [];
			while(words.length > 0) {
				var word = words.shift();
				var token = {
					// ya know, windows ...
					token: word.replace('\r', ''),
					line: this.currentLine
				};
				if (word[0] === '@') {
					this.mentions.push(token);
					this.addTask(token);
				} else {
					this.tokens.push(token);
				}
			}
			return line;
		},

		countLine: function countLine(line) {
			this.currentLine += 1;
			return line;
		},

		addTask: function addTask (mention) {
			if (!this.tasks[mention.token]) {
				this.tasks[mention.token] = [];
			}
			this.tasks[mention.token].push(mention.line);
		}
	};
};

module.exports = Tokenizer;
