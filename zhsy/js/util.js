Array.prototype.indexOf = function(value) {
	for (var i = 0, len = this.length; i < len; i++) {
		if (this[i] === value) {
			return i;
		}
	}
	return -1;
}

Array.prototype.lastIndexOf = function(value) {
	var len = this.length;
	while (len--) {
		if (this[len] === value) {
			return len;
		}
	}
	return -1;
}

Array.prototype.contains = function(value) {
	return this.indexOf(value) > -1;
}

Array.prototype.sortNumber = function(desc) {
	if (this.length) {
		this.sort(function(x, y) {
			if (desc && desc == "desc") {
				return y - x;
			}
			return x - y;
		});
	}
}

// unique-1
Array.prototype.unique = function() {
	var hash = {}, len = this.length, result = [];
	for (var i = 0; i < len; i++) {
		if (!hash[this[i]]) {
			result.push(this[i]);
			hash[this[i]] = true;
		}
	}
	return result;
}
// unique-2 数字元素排序后...
Array.prototype.unique2 = function() {
	this.sortNumber();
	var result = [ this[0] ];
	for (var i = 1; i < this.length; i++) {
		if (this[i] > result[result.length - 1]) {
			result.push(this[i]);
		}
	}
	return result;
}
