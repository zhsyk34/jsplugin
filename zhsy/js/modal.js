(function($) {
	$.fn.modal = function(options, param) {
		if (typeof options == "string") {
			return $.fn.modal.methods[options](this, param);
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "modal");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "modal", {
					options : $.extend({}, $.fn.modal.defaults, options)
				});
			}
			init(this);
		});
	};

	$.fn.modal.defaults = {
		header : true,
		title : "title",
		closable : true,
		content : null,
		footer : null,
		buttons : [ "sure", "cancel" ],// [ "sure", "cancel", "reset" ],
		width : "auto",
		height : "auto",
		left : null,
		top : null,
		before : function() {
		},
		after : function() {
		},
		closed : true,
		mask : true,
		blur : false,// TODO
		zIndex : 2015,
		openAnimation : true,
		openDuration : 500,
		closeAnimation : true,
		closeDuration : 500
	};

	$.fn.modal.methods = {
		options : function(target) {
			return $.data(target[0], "modal").options;
		},
		open : function(target) {
			var options = this.options(target);

			// mask
			if (options.mask) {
				$(target).parents(".mask").show();
			}
			// blur
			if (options.blur) {
				var content = $("body").children(":not(.blur,.mask,.modal,script)");
				var blur = $("<div class='blur'></div>").append(content).appendTo($("body"));
			}
			// show
			if (options.openAnimation) {
				$(target).parents(".modal").fadeIn(options.openDuration);
			} else {
				$(target).parents(".modal").show();
			}
		},
		close : function(target, direct) {// direct:是否直接关闭
			var options = this.options(target);

			if (!direct && options.before.call(target) === false) {// 阻止关闭
				return;
			}

			if (options.closeAnimation) {
				$(target).parents(".modal").fadeOut(options.closeDuration, function() {
					close();
				});
			} else {
				$(target).parents(".modal").hide();
				close();
			}

			function close() {
				if (options.mask) {
					$(target).parents(".mask").hide();
				}
				if (options.blur) {
					$("body>.blur").removeClass("blur");
				}
				options.after.call(target);
			}
		},
		clear : function(target) {
			$(target).find("input:not(:radio,:checkbox)").val("");
			$(target).find(":radio:first").prop("checked", true);
			$(target).find(":checkbox").prop("checked", false);
			$(target).find("select option:first").prop("selected", true);
			$(target).find("textarea").val("");
		},
		title : function(target, param) {
			$(target).parents(".modal").find(".modal-title").text(param);
		}
	};

	function init(target) {
		var options = $.data(target, "modal").options;
		/* init html */
		// modal
		var modal = $(target).parents(".modal");
		if (!modal.hasClass("modal")) {
			modal = $("<div class='modal'></div>").appendTo($("body"));
		}
		modal.children().detach();

		// header
		if (options.header) {
			var header = $("<div class='modal-header'></div>").prependTo(modal);
			if (options.title) {
				$("<h3 class='modal-title'></h3>").text(options.title).appendTo(header);
			}
			if (options.closable) {
				$("<span class='modal-close'></span>").appendTo(header);
			}
		}
		// content
		var content = $("<div class='modal-content'></div>").appendTo(modal).append(target);

		// footer
		if (options.footer || options.buttons) {
			var footer = $("<div class='modal-footer'></div>").appendTo(modal);
			if (options.footer) {
				footer.append(options.footer);
			}
			if (options.buttons) {
				for (var i = 0, len = options.buttons.length; i < len; i++) {
					var button = options.buttons[i];
					switch (button) {
					case "sure":
						$("<button class='btn btn-success modal-sure'>确定</button>").appendTo(footer);
						break;
					case "cancel":
						$("<button class='btn btn-warning modal-cancel'>取消</button>").appendTo(footer);
						break;
					case "reset":
						$("<button class='btn btn-info modal-reset'>重置</button>").appendTo(footer);
						break;
					}
				}
			}
		}

		// mask
		var mask = modal.parent();
		if (options.mask) {
			if (!mask.hasClass("mask")) {
				mask = $("<div class='mask'></div>").append(modal);
				$("body").append(mask);
			}
		} else if (mask.hasClass("mask")) {
			modal.unwrap();
		}

		/* init css */
		// size
		content.css({
			width : options.width,
			height : options.height
		});

		// position
		if (options.left == null) {
			modal.css({
				left : "50%",
				marginLeft : -modal.width() * 0.5
			});
		} else {
			modal.css("left", options.left);
		}

		if (options.top == null) {
			modal.css({
				top : "50%",
				marginTop : -modal.height() * 0.6
			});
		} else {
			modal.css("top", options.top);
		}

		// visibility
		options.closed ? modal.hide() : $(target).modal("open");
		// zIndex
		modal.css("z-index", options.zIndex);
		if (options.mask) {
			mask.css("z-index", options.zIndex - 1);
		}

		/* listener */
		modal.off(".modal");
		modal.on("click.modal", ".modal-sure", function() {
			$(target).modal("close");
		});
		modal.on("click.modal", ".modal-cancel,.modal-close", function() {
			$(target).modal("close", true);
		});
		modal.on("click.modal", ".modal-footer .modal-reset", function() {
			$(target).modal("clear");
		});
	}
	/* alert */
	$.alert = function(param) {
		var options = {
			header : null,
			zIndex : 9999,
			buttons : [ "sure" ],
			width : 300,
			height : 120,
			before : function() {
				return false;
			}
		};

		var target = $(".modal-alert-info").length > 0 ? $(".modal-alert-info") : $("<div class='modal-alert-info'></div>").appendTo("body");

		var state = $.data(target[0], "modal");

		if (typeof param == "object") {
			target.modal($.extend(options, state ? state.options || {} : {}, param));
		} else {
			target.modal($.extend(options, state ? state.options || {} : {}));
		}

		target.parent().addClass("modal-alert");

		if (typeof param == "string" || typeof param == "number") {
			return target.text(param).modal("open");
		}

	}
	/* confirm */
	$.confirm = function(param) {
		var options = {
			header : null,
			zIndex : 9999,
			buttons : [ "sure", "cancel" ],
			width : 300,
			height : 120,
			before : function() {
				return false;
			}
		};
		var target = $(".modal-confirm-info").length > 0 ? $(".modal-confirm-info") : $("<div class='modal-confirm-info'></div>").appendTo("body");

		var state = $.data(target[0], "modal");

		if (typeof param == "object") {
			$.extend(options, state ? state.options || {} : {}, param)
		} else {
			$.extend(options, state ? state.options || {} : {});
		}

		target.modal(options);

		target.parent().addClass("modal-confirm");

		if (typeof param == "string" || typeof param == "number") {
			return target.text(param).modal("open");
		}
	}
})(jQuery);
