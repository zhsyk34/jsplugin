(function($) {
	$.fn.drag = function(options, param) {
		if (typeof options == "string") {
			return $.fn.drag.methods[options](this, param);
		}

		return this.each(function() {
			var state = $.data(this, "drag");
			if (state) {
				$.extend(state.options, options || {});
			} else {
				$.data(this, "drag", {
					options : $.extend({}, $.fn.drag.defaults, options || {})
				});
			}
			listener(this);
		});
	};

	function listener(target) {

		var options = $(target).drag("options");
		if (options.disabled || options.onBefore.call(target) == false) {
			$(this).css("cursor", "");
			return;
		}

		$(target).off(".drag").on("mouseleave.drag", function() {
			$(this).css("cursor", "");
		});

		$(target).on("mousedown.drag", function(original) {
			if (options.onStart.call(target, original) == false) {
				return;
			}

			var offset = $(this).offset();
			var proxy = null;

			if (options.proxy) {
				proxy = $(target).clone().insertAfter(target);
				proxy.css("position", "absolute");
				proxy.offset(offset);
			}

			$(document).on("mouseup.drag", function(e) {
				$(this).off(".drag");

				if (options.revert) {
					$(target).offset({
						left : offset.left,
						top : offset.top
					});
				}
				if (proxy) {
					proxy.remove();
				}

				options.onStop.call(target, e);
			});

			$(document).on("mousemove.drag", function(current) {
				if (options.onDrag.call(target, current) == false) {
					return;
				}
				checkArea(current, target);
				var dx = options.axis == "y" ? 0 : current.clientX - original.clientX;
				var dy = options.axis == "x" ? 0 : current.clientY - original.clientY;
				// $(target).offset({
				// left : offset.left + dx,
				// top : offset.top + dy
				// });
			});
		});
	}

	function checkArea(e, target) {
		var options = $(target).drag("options");
		var offset = $(target).offset();
		var width = $(target).outerWidth();
		var height = $(target).outerHeight();
		var t = e.pageY - offset.top;
		var r = offset.left + width - e.pageX;
		var b = offset.top + height - e.pageY;
		var l = e.pageX - offset.left;

		console.log(t, r, b, l);

		return Math.min(t, r, b, l) > options.edge;
	}

	$.fn.drag.defaults = {
		proxy : null,
		revert : false,
		cursor : "move",
		deltaX : null,
		deltaY : null,
		handle : null,
		isDragging : false,
		disabled : false,
		edge : 0,
		axis : null, // x||y
		delay : 100,
		onBefore : function() {
		},
		onStart : function(e) {
		},
		onDrag : function(e) {
		},
		onStop : function(e) {
		}
	};

	$.fn.drag.methods = {
		options : function(target) {
			return $.data(target[0], "drag").options;
		},
		proxy : function(target) {
			return $.data(target[0], "drag").proxy;
		},
		enable : function(target) {
			return $(target).each(function() {
				$(this).drag({
					disabled : false
				});
			});
		},
		disable : function(target) {
			return $(target).each(function() {
				$(this).drag({
					disabled : true
				});
			});
		}
	};
})(jQuery);
