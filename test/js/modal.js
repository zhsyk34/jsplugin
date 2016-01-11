$(function() {
	testModal();
	// testAlert();
	// testConfirm();
});
function testAlert() {

	$.alert({
		zIndex : 7777,
		before : function() {
			$.alert("让你直接关闭!");
			return true;
		},
		after : function() {
			$.alert("再弹一次,哇哈哈...");
			$.alert({
				before : function() {
					return true;
				},
				after : function() {
					$.alert("算了,真的让你关闭");
					$.alert({
						before : function() {
							return true;
						},
						after : function() {
						}
					});
				}
			});
		}
	});
	$.alert("模拟alert窗口(全局只有一个),确认事件默认返回false以阻塞代码(通过回调,可定义在after内),同时测试z-index层级");
}

function testConfirm() {

	$.confirm({
		zIndex : 9999,
		left : 300,
		top : 200,
		buttons : [ "sure" ],
		before : function() {
			console.log("已开启直接关闭");
			return true;
		},
		after : function() {
			$.alert({
				before : function() {
					return true;
				}
			});
			$.alert("关闭了?天真...");
		}
	});
	// $.confirm("重复开启,同alert,取消可直接关闭....");
	$.confirm("模拟confirm窗口,同alert,取消可直接关闭");
}
function testModal() {
	// 1
	$("#test").modal({
		left : 100,
		top : 100,
		width : 800,
		height : 450,
		title : "测试弹窗一,自定义大小和偏移,定义式直接打开",
		closed : false
	});

	// 2
	$("#test2").modal({
		left : 150,
		top : 80,
		zIndex : 3333,
		width : 300,
		height : 180,
		title : "测试弹窗二,多开,确定不能关",
		before : function() {
			// return false;
		},
		after : function() {
			$(this).modal("title", "新标题");
			$(this).modal("open");
		}
	});
	$("#test2").modal("open");
}