$(function() {
	forbidText();
	init();
	move();
});
function move() {
	$("button:first").on("click", function() {
		$(".test").drag({
			proxy : false,
			revert : false,
			cursor : "move",
			container : null,
			disabled : false,
			edge : 0,
			axis : null,
			onBefore : function() {
			},
			onMove : function(e) {
			},
			onStop : function(e) {
			}
		});
	});
	$("button").eq(1).on("click", function() {
		$(".test").drag({
			proxy : false,
			revert : false,
			cursor : "move",
			container : null,
			disabled : false,
			edge : 0,
			axis : "y",
			onBefore : function() {
			},
			onMove : function(e) {
			},
			onStop : function(e) {
			}
		});
	});
	$("button").eq(2).on("click", function() {
		$(".test").each(function() {
			$(this).drag({
				proxy : false,
				revert : false,
				cursor : "move",
				container : $(this).parent(),
				disabled : false,
				edge : 30,
				axis : null,
				onBefore : function() {
				},
				onMove : function(e) {
				},
				onStop : function(e) {
				}
			});
		});
	});
	$("button").eq(3).on("click", function() {
		$(".test").drag({
			proxy : true,
			revert : false,
			cursor : "move",
			container : null,
			disabled : false,
			edge : 0,
			axis : null,
			onBefore : function() {
			},
			onMove : function(e) {
			},
			onStop : function(e) {
			}
		});
	});
	$("button").eq(4).on("click", function() {
		$(".test").drag({
			proxy : false,
			revert : false,
			cursor : "move",
			container : null,
			disabled : false,
			edge : 0,
			axis : null,
			onBefore : function() {
			},
			onMove : function(e) {
			},
			onStop : function(e) {
				locate($(this), $(".test").not(this));
			}
		});
	});

}
function forbidText() {
	$("body").on("selectstart", function() {
		return false;
	});
	$("body").css("-moz-user-select", "none");
}
function init() {
	var a = 15, b = 16, c = 17;
	for (var i = 0; i < a; i++) {
		$(".parent:first").append("<div class='test'>" + (i + 1) + "</div>");
	}
	for (var i = a; i < a + b; i++) {
		$(".parent:not(:first,:last)").append("<div class='test'>" + (i + 1) + "</div>");
	}
	for (var i = a + b; i < a + b + c; i++) {
		$(".parent:last").append("<div class='test'>" + (i + 1) + "</div>");
	}
	$(".test").css("background", randomColor);

	function randomColor() {
		return "#" + ("00000" + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
	}
}

// 重新定位
function locate(target, list) {
	// 原来位置
	var ox = parseInt(target.offset().left), oy = parseInt(target.offset().top);
	var h = parseInt(target.outerHeight());
	var cx, cy;// 插入位置
	var index = 0;// cx索引

	// 计算cy
	var varr = [];
	list.each(function() {
		var p = $(this).offset();
		varr.push(parseInt(p.top));
	});
	cy = varr.range(oy, h).min;
	if (Number.NEGATIVE_INFINITY === cy) {
		cy = varr.range(oy, h).max;
	}

	var ylist = list.filter(function() {
		var top = parseInt($(this).offset().top);
		return top == cy;
	});

	// 定位cx
	var harr = [];
	ylist.each(function() {
		var p = $(this).offset();
		harr.push(parseInt(p.left));
	});

	var cx = harr.range(ox).min;
	index = $.inArray(cx, harr);

	if (index == -1) {
		target.insertBefore(ylist.eq(0));
	} else {// TODO 自身微调
		target.insertAfter(ylist.eq(index));
	}
	target.css("position", "static");
}

// 排序+去重
Array.prototype.unique = function() {
	this.sort(function(x, y) {
		return x - y;
	});

	var result = [ this[0] ];
	for (var i = 1; i < this.length; i++) {
		if (this[i] > result[result.length - 1]) {
			result.push(this[i]);
		}
	}
	return result;
}

// 区间
Array.prototype.range = function(n, r) {
	var arr = this.unique();
	arr.unshift(-Infinity);
	arr.push(Infinity);

	var result = {};
	for (var i = 0; i < arr.length - 1; i++) {
		if (n > arr[i] && n <= arr[i + 1]) {
			result.min = arr[i];
			result.max = arr[i + 1];

			if (r && (n > arr[i] + r)) {
				result.min = arr[i + 1];
			}
			return result;
		}
	}
}