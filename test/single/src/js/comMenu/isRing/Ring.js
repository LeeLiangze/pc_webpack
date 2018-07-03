/**
 * 
 * 设置有铃 move by zhangyingsheng 2017.02.07
 * 
 */
define(function() {
	var initialize = function(index) {
		this._index = index;
		yRing.call(this);
	};
	// 有铃
	var yRing = function() {
		var isRing = this._index.main.getIsRing();
		if (isRing) {
			// alert("已是有铃状态!");
			this._index.popAlert("已是有铃状态!");
		} else if (isRing == undefined) {
			// alert("设置失败!");
			this._index.popAlert("设置有铃失败!");
		} else {
			this._index.main.setYRing();
			// alert("设置有铃成功!");
			this._index.popAlert("设置有铃成功!");
		}
	};
	return initialize;
});