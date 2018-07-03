/**
 * 对轮循中监听到的CTI事件，进行处理的函数集合。
 * comUI可直接对按钮进行操作
 * 各事件处理函数中的 第一个参数，对于我们处理事件，咩有用户，可以忽略。事件的data均存放在第二个参数中。
 */
define(['Util',
        '../callingInfoMap/CallingInfo',
        '../../index/constants/mediaConstants',
        '../../content/AudioRecord',
        '../../clientInfo/MultiAccountInfo',
        '../../content/mediaMessage',
        './answerRequestEvent',
        './internalHelpResultEvent',
        './callOutResultEvent',
        './releaseSuccessEvent',
        './startTalkingEvent',
        './recordResultEvent',
        './recordStopEvent',
        './agentStateChangeEvent3',
        './agentStateChangeEvent46',
        './restTimeOutEvent',
        './agentStateChangeEvent5',
        './agentStateChangeEvent7',
        './agentStateChangeEvent8',
        './agentStateChangeEvent9',
        './forceOutEvent',
        './receiveNoteEvent',
        './agentOutInInsertListenEvent',
        './transOutResultEvent',
        './messageData',
        './playEndEvent',
        './returnFromIvrEvent'
        ],
        function(Util,
        		CallingInfoIns,
        		Constants,
        		AudioRecord,
        		MultiAccountInfo,
        		MediaMessage,
        		answerRequestEvent,
        		internalHelpResultEvent,
        		callOutResultEvent,
        		releaseSuccessEvent,
        		startTalkingEvent,
        		recordResultEvent,
        		recordStopEvent,
        		agentStateChangeEvent3,
        		agentStateChangeEvent46,
        		restTimeOutEvent,
        		agentStateChangeEvent5,
        		agentStateChangeEvent7,
        		agentStateChangeEvent8,
        		agentStateChangeEvent9,
        		forceOutEvent,
        		receiveNoteEvent,
        		agentOutInInsertListenEvent,
        		transOutResultEvent,
        		messageData,
        		playEndEvent,
        		returnFromIvrEvent) {
	var index;
	var comUI;
	var CTIID;
	var EventsDeal = function(indexModule){
		index = indexModule;
		comUI = index.comMenu.comUI;
		
		return returnObj(indexModule);
	}
	var returnObj=function(index){
		 _answerRequestEvent = new answerRequestEvent(index);
		 _callOutResultEvent=new callOutResultEvent(index);
		_internalHelpResultEvent = new internalHelpResultEvent(index);
		_releaseSuccessEvent = new releaseSuccessEvent(index);
		_startTalkingEvent = new startTalkingEvent(index);
		_recordResultEvent = new recordResultEvent(index);
		_recordStopEvent = new recordStopEvent(index);
		_agentStateChangeEvent46 = new agentStateChangeEvent46(index);
		_restTimeOutEvent = new restTimeOutEvent(index);
		_agentStateChangeEvent3=new agentStateChangeEvent3(index);
		_agentStateChangeEvent5 = new agentStateChangeEvent5(index);
		_agentStateChangeEvent7 = new agentStateChangeEvent7(index);
		_agentStateChangeEvent8 = new agentStateChangeEvent8(index);
		_agentStateChangeEvent9 = new agentStateChangeEvent9(index);
		_forceOutEvent = new forceOutEvent(index);
		_receiveNoteEvent = new receiveNoteEvent(index);
		_agentOutInInsertListenEvent = new agentOutInInsertListenEvent(index);
		_transOutResultEvent = new transOutResultEvent(index);
		_messageData = new messageData(index);
		_playEndEvent = new playEndEvent(index);
		_returnFromIvrEvent = new returnFromIvrEvent(index);
		return {
			//300事件，处理请求应答事件（人答模式下有新请求会触发该事件，自答模式下会直接应答，即不会进入该事件）
			answerRequestEvent:_answerRequestEvent.answerRequestEvent ,
			//302，呼出结果事件
			callOutResultEvent:_callOutResultEvent.callOutResultEvent ,
			// 307, 处理内部求助结果事件
			internalHelpResultEvent:_internalHelpResultEvent.internalHelpResultEvent,
			//301 处理释放成功事件(用户释放呼叫时触发)
			 releaseSuccessEvent:_releaseSuccessEvent.releaseSuccessEvent ,
			 //304 通话状态变化事件,解析通话状态变化(通话开始)事件中的数据
			 startTalkingEvent:_startTalkingEvent.startTalkingEvent ,
			 //305 处理录音结果事件
			 recordResultEvent:_recordResultEvent.recordResultEvent ,
			 //306 录音停止事件
			 recordStopEvent:_recordStopEvent.recordStopEvent,
			 //351-3  座席状态变更事件-示忙
			 agentStateChangeEvent3:_agentStateChangeEvent3.agentStateChangeEvent3 ,
			 //351-4  351-6 示闲事件
			 agentStateChangeEvent46:_agentStateChangeEvent46.agentStateChangeEvent46 ,
			 //353 处理座席休息时间到事件
			 restTimeOutEvent :_restTimeOutEvent.restTimeOutEvent,
			 //整理态事件，351-5座席状态变更事件-整理/工作
			 agentStateChangeEvent5 :_agentStateChangeEvent5.agentStateChangeEvent5,
			 //351-7  座席状态变更事件-通话
			 agentStateChangeEvent7 :_agentStateChangeEvent7.agentStateChangeEvent7,
			 //351-8 座席状态变更事件-休息
			 agentStateChangeEvent8 :_agentStateChangeEvent8.agentStateChangeEvent8,
			 //351 -9 座席状态变更事件-学习
			 agentStateChangeEvent9 :_agentStateChangeEvent9.agentStateChangeEvent9,
			 //352  强制签出事件
			 forceOutEvent :_forceOutEvent.forceOutEvent ,
			 // 355事件 发送通知（便签） 
			 receiveNoteEvent:_receiveNoteEvent.receiveNoteEvent ,
			 // 402 处理被监听座席签出事件
			 agentOutInInsertListenEvent:_agentOutInInsertListenEvent.agentOutInInsertListenEvent,
			 //303 转出结果事件
			 transOutResultEvent:_transOutResultEvent.transOutResultEvent ,
			 //451  处理多媒体信息数据事件
			 messageData:_messageData.messageData ,
			 //401 放音结束事件
			 playEndEvent : _playEndEvent.playEndEvent,
			 //308 从IVR返回事件  
			 returnFromIvrEvent:_returnFromIvrEvent.returnFromIvrEvent
		};
	};
	
	
	
	// 日期格式化 by yujiaoli wx224989 20160625 start
	Date.prototype.format = function(format){ 
		var o = { 
				"M+" : this.getMonth()+1, // month
				"d+" : this.getDate(), // day
				"h+" : this.getHours(), // hour
				"m+" : this.getMinutes(), // minute
				"s+" : this.getSeconds(), // second
				"q+" : Math.floor((this.getMonth()+3)/3), // quarter
				"S" : this.getMilliseconds() // millisecond
		} 

		if(/(y+)/.test(format)) { 
			format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 

		for(var k in o) { 
			if(new RegExp("("+ k +")").test(format)) { 
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
			} 
		} 
		return format; 
	} 
	 

	return EventsDeal;
});