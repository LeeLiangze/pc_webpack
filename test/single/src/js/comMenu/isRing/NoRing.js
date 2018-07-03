/**
 * 
 * 设置无铃 move by zhangyingsheng 2017.02.07
 * 
 */
define(function() {
	var initialize = function(index) {
		this._index = index;
		nRing.call(this);
	};
	// 无铃
	var nRing = function() {
		var isRing = this._index.main.getIsRing();
		if (isRing) {
			this._index.main.setNRing();
			// alert("设置无铃成功!");
			this._index.popAlert("设置无铃成功!");
		} else if (isRing == undefined) {
			// alert("设置失败!");
			this._index.popAlert("设置无铃失败!");
		} else {
			// alert("已是无铃状态!");
			this._index.popAlert("已是无铃状态!");
		}
	};
	return initialize;
});