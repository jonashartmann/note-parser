var Writer = function Writer(writable) {
	var buf = '';
	return {
		buffer: function buffer (str) {
			str = str || '';
			buf += str;
			return this;
		},
		write: function write (str) {
			str = str || '';
			writable.write(str.replace(/ \n+/g, '\n'));
			return this;
		},
		writeLine: function writeLine (str) {
			str = str || '';
			this.write(str + '\n');
			return this;
		},
		flush: function flush () {
			this.write(buf);
			buf = '';
			return this;
		}
	};
};

module.exports = Writer;
