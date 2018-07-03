/**
 * 前台界面的常量定义
 */
define(function(){
	var map = {};
	var host = window.location.host;
	/*********************省份编码常量   start************************/
	map['000'] = "总部";
	map['010'] = "北京";
	map['020'] = "广东 ";
	map['021'] = "上海";
	map['022'] = "天津";
	map['023'] = "重庆";
	map['024'] = "辽宁 ";
	map['025'] = "江苏 ";
	map['027'] = "湖北 ";
	map['028'] = "四川 ";
	map['029'] = "陕西 ";
	map['0311'] = "河北 ";
	map['0351'] = "山西 ";
	map['0371'] = "河南 ";
	map['0431'] = "吉林 ";
	map['0451'] = "黑龙江";
	map['0471'] = "内蒙古";
	map['0531'] = "山东 ";
	map['0551'] = "安徽 ";
	map['0571'] = "浙江 ";
	map['0591'] = "福建 ";
	map['0731'] = "湖南 ";
	map['0771'] = "广西 ";
	map['0791'] = "江西 ";
	map['0851'] = "贵州 ";
	map['0871'] = "云南 ";
	map['0891'] = "西藏 ";
	map['0898'] = "海南 ";
	map['0931'] = "甘肃 ";
	map['0951'] = "宁夏 ";
	map['0971'] = "青海 ";
	map['0991'] = "新疆 ";
	/*********************省份编码常量   end************************/
	return{
		PROVICEMAP:map,
		/* CTI接续事件（EventId）枚举  start */
		/* 转出的设备类型   枚举start	*/
		//		1：技能队列
		TRANSFERDEVICETYPE_SKILL_QUEUE : '1',
		//		2：座席；
		//TRANSFERDEVICETYPE_SEAT : '2',
		//		3：IVR；
		TRANSFERDEVICETYPE_IVR : '2',
		//		4：系统接入码；
		TRANSFERDEVICETYPE_SYSTEM_ACCESS  : '3',
		//		5：外呼号码
		TRANSFERDEVICETYPE_OUTBOUND : '0',
		/* 转出的设备类型   end	*/
		// 请求应答
		CALL_ANSWER_REQUEST : 300,
		// 释放成功
		CALL_RELEASE_SUCCESS : 301,
		// 呼出结果
		CALL_CALLOUT_RESULT : 302,
		//  转出结果
		CALL_TRANSOUT_RESULT : 303,
		//  通话状态变化(通话开始)
		CALL_START_TALKING : 304,
		//  录音结果
		CALL_RECORD_RESULT : 305,
		//  录音结束
		CALL_RECORD_STOP : 306,

		// 对外的事件ID，座席相关，范围：351-400.
		//  座席状态变更
		AGENT_STATE_CHANGE : 351,
		//  强制签出
		AGENT_FORCE_OUT : 352,
		//  座席休息时间到
		AGENT_REST_TIMEOUT : 353,
		//  座席自动离开整理态
		AGENT_LEAVE_WRAPUP_STATE : 354,

		// 对外的事件ID，质检相关，范围：401-450.
		//  放音结束
		QUALITY_PLAY_END : 401,
		//  被监听座席签出
		QUALITY_AGENT_OUT_ININSERT_LISTEN : 402,

		//对外的事件ID，其他，范围：451-500.
		//  多媒体信息数据
		MESSAGE_DATA : 451,
		/* CTI接续事件（EventId）枚举  end */

		/* CTI座席状态（State）枚举  start */
		// 签入
		SEATING_CHECK_IN : 1,
		// 签出
		SEATING_CHECK_OUT : 2,
		// 示忙
		SEATING_BUSY : "3",
		// 空闲
		SEATING_EMPTY : "4",
		// 整理
		SEATING_CLEARED : 5,
		// 通话
		SEATING_CALLING : 7,
		// 休息
		SEATING_OFF : 8,
		// 学习
		SEATING_STUDY : 9,
		/* CTI座席状态（State）枚举  end */

		/* 媒体类型标识（MediaTypeId）枚举  start */
		//语音
		VOICE_TYPE:"5",
		//  web在线客服网页版
		MEDIA_ONLINE_SERVICE : "01",
		//  短信（10065）
		SHORT_MESSAGE_TYPE : "02",
		//  微信（中国移动10086）
		WEIXIN_TYPE : "03",
		//  飞信
		FETION_TYPE : "04",
		//  wap
		MICROBLOGGING_WAP : "05",
		//  10086社区
		FETION_COMMUNITY_10086 : "06",
		//  手机端H5
		MOBILEAPP_H5 : "07",
		//  APP
		APP_TYPE : "08",
		//  微博
		MICROBLOGGING_TYPE : "09",
		//  139邮箱
		EMAIL_139 : "10",
		//  其他
		UNKNOW_TYPE : "00",
		/* 媒体类型标识（MediaTypeId）枚举 end */

		/* 消息类型（MsyType）枚举  start */
		// 文本
		MSGTYPE_TEXT : "001",
		// 图片
		MSGTYPE_IMG : "002",
		// 音频
		MSGTYPE_AUDIO : "003",
		// 视频
		MSGTYPE_VIDEO : "004",
		// 小视频
		MSGTYPE_SMALL_VIDEO : "005",
		// 链接
		MSGTYPE_URL : "006",
		// 地理位置
		MSGTYPE_GEOGRAPHIC_LOCATION : "007",
		//录音
		MSGTYPE_RECORD : "801",
		// 其他文件类附件，如word、excel、zip等
		MSGTYPE_OTHER_FILE : "999",
		/* 消息类型（MsyType）枚举  end */

		/*解析多媒体消息（消息发生方）枚举start */
		//用户
		SENDER_FLAG_CUST : "0",
		//坐席
		SENDER_FLAG_SEAT : "1",
		//机器人
		SENDER_FLAG_ROBOT : "2",
		//系统消息, add by 张志勇
		SENDER_FLAG_SYSTEM : "3",
		/*解析多媒体消息枚举end */

		/* 消息撤销标志位start */
		// 已撤销
		CANCEL_FLAG_YES : "1",
		// 未撤销
		CANCEL_FLAG_NO  : "0",
		/* 消息撤销标志位end */

		/*解析多媒体消息（最大缓存数）枚举start */
		//缓存最大条数
		MAX_REDIS_NUM : "151",
		/*解析多媒体消息枚举（最大缓存数）end */

		/*挂机方	枚举start */
		TYPE_ID_USERSATISFY : "003",
		//用户挂机
		RELEASETYPE_USER : "0",
		//话务员挂机
		RELEASETYPE_OPERATOR : "1",
//		//密码验证失败自动挂机
//		RELEASETYPE_PASSWORD_AUTHENTICATION_FAILED  : "2",
//		//其他
//		RELEASETYPE_OTHER : "3",
		//转IVR挂机
		RELEASETYPE_TRANSFER_IVR : "2",
		/*挂机方	end */

		/* 转出的设备类型   枚举start	*/
		//		1：技能队列
		CALLEDDEVICETYPE_SKILL_QUEUE : '1',
		//		2：座席；
		CALLEDDEVICETYPE_SEAT : '2',
		//		3：IVR；
		CALLEDDEVICETYPE_IVR : '3',
		//		4：系统接入码；
		CALLEDDEVICETYPE_SYSTEM_ACCESS  : '4',
		//		5：外呼号码
		CALLEDDEVICETYPE_OUTBOUND : '5',
		/* 转出的设备类型   end	*/
		//配置菜单系统变量
		ITEMID:'129001001',
		/* 转出时的模式   枚举start	*/
		//		0：释放转
		TRANSFERMODE_RELEASE : '0',
		//		1 挂起转/释放转
		TRANSFERMODE_SUSPEND : '1',
		//		2：成功转。
		TRANSFERMODE_SUCCESS : '2',
		//		3：通话转/指定转。
		TRANSFERMODE_CALLING : '3',
		//		4：三方转/合并转。
		TRANSFERMODE_TOGETHER : '4',
		/* 转出时的模式  end	*/

		/*BINDTYPE 绑定方式  枚举   start*/
		//		自动绑定
		BINDTYPE_AUTO : '01',
		//		人工绑定
		BINDTYPE_PERSONAL : '02',
		/*BINDTYPE 绑定方式  枚举   end*/

		/*接触历史记录分页  枚举   start*/
		//		自动绑定
		HISTORY_TPAGESIZE : '1',
		//		人工绑定
		HISTORY_PAGENUM : '0',
		//		历史记录的天数
		HISTORY_DAY : '7',
		//
		HISTORY_START:'0',
		HISTORY_LIMIT:'10',
		/*接触历史记录分页  枚举   end*/
		//微博身份 性别：男
		GENDER_MAN:'m',
		//微博身份 性别：女
		GENDER_FEMALE:'f',
		//微信身份 性别：男
		GENDER_WEIXIN_MAN:'1',
		//微博身份 性别：女
		GENDER_WEIXIN_FEMALE:'2',

		/*服务请求队列区时间  枚举   start*/
		//未处理会话警告时间
		QUEUETIMEOUT : '0450',
		//渠道图片闪烁时间	秒
		QUEUEPECTUREBLING : '0010',
		//默认最大接入数
		SESSIONMAX : '5',
		/*服务请求队列区时间  枚举   end*/

		//ccacs的url常量 为http
		CCACSURL : "",
		
		//打开受理请求的url地址
		ACCEPT_REQUEST_MENU_URL : "https://211.138.24.183/ngwf/#js/workflow/requestAccept",
		KNOWLEDGE_SEARCH_MENU_URL : "https://112.33.2.66:8092/login.html?otoken=62cd47dd738763702046bac31d65815e_625_1477015717810",
		CUSTOMER_SERVICE_LOGO_URL : "src/assets/img/mediaIcon/service/ic-service.png",
		//发送通知里面历史中的当前发送通知的人员图片
		NOTE_SERVICE_LOGO_URL : "src/assets/img/appNew/ic-service-32x32.png",
		//图片库前缀
		PICTURE_URL_PREFIX : "mediaresource/agents/images/library/",

		//用户初始化密码
		STAFFINITPASSWORD : '1qaz!QAZ',

		/*********************360视图页面相关常量 start************************/
		/*********************360视图页面相关常量 以注释内容为准，dev分支暂时写成测试环境地址方便测试，请合并代码时特别注意************************/
		//实时话费查询
		//"totalChargesQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/totalChargesQuery",
		"totalChargesQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/totalChargesQuery",
		//账单查询
		//"billQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/billQuery",
		"billQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/billQuery",
		//缴费记录查询
		//"paymentInfoListQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/paymentInfoListQuery",
		"paymentInfoListQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/paymentInfoListQuery",
		//已订购业务查询
		//"busiInfoListQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/busiInfoListQuery",
		"busiInfoListQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/busiInfoListQuery",
		//积分查询
		//"pointQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/pointQuery",
		"pointQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/pointQuery",
		//套餐余量查询
		//"mealinfosListQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/mealinfosListQuery",
		"mealinfosListQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/mealinfosListQuery",
		//流量查询
		//"flowsQuery" : "https://211.138.24.183/ngba/#js/globalAbility/pc/query/flowsQuery",
		"flowsQuery" : "https://"+host+"/ngba/#js/globalAbility/pc/query/flowsQuery",
		//手机验证码绑定
		//"authPassword" : "https://211.138.24.183/ngba/#js/globalAbility/pc/authPassword",
		"authPassword" : "https://"+host+"/ngba/#js/globalAbility/pc/authPassword",
		/*********************360视图页面相关常量 start************************/
		/*********************业务树纠错接收人常量（多个人员之间用,隔开） start************************/
		COLLECT_LIMIT : 30,
		CORRECT_SEND_PID : "101",
		CORRECT_SEND_PNAME: "系统管理员",
		// CORRECT_ROLE_ID:"201612221008270000000000000102",
		CORRECT_ROLE_ID:"201703141955440000000000000056",
		/*********************业务树纠错接收人常量 start************************/

		/*********************留言处理状态常量 start************************/
		/**
		 * 未处理
		 */
		UNPROCESSED : "0",
		/**
		 * 待处理
		 */
		CORRESPONDENCE : "1",
		/**
		 * 已处理
		 */
		PROCESSED : "2",
		/**
		 * 已撤销
		 */
		REVOKED :"3",
		/*********************留言处理状态常量 end************************/

		SERVICE_TYPE_GX_ZZ_DEV : "86otck", //洛阳测试环境 gxytck 暂时改下
		SERVICE_TYPE_GX_ZZ_SIT : "10086otck",
		SERVICE_TYPE_GX_LY_SIT : "gxytck",
		SERVICE_TYPE_GX_LY_PRD_DEMO : "iotcs",//自研cti测试环境
		SERVICE_TYPE_GX_LY_PRD : "gxytck_prd",
		/**
		 * 
		 * 调用接入侧接口返回值
		 */
		RETURNCODE_NGMMGW:"00000",
		/**
		 * 满意度状态_发出邀请，待评价
		 */
		SATIFATION_STATUS_PUSH:"05",
		/**
		 * 满意度—发出邀请，待评价
		 */
		USERSATISFY_PUSH:"6",
		XINFANGENTERKEY:"111111",

		/**
		 * 呼叫转出
		 */
		TRANSFERMODE_SUSPENDDESC:"释放转",
		TRANSFERMODE_SUCCESSDESC:"成功转",
		TRANSFERMODE_CALLINGDESC:"通话转",
		TRANSFERMODE_TOGETHERDESC:"三方转",

		/**
		 *呼叫转出参数配置
		 */
		TRANSFEROUTPARAM_INPUT:'0',//输入框
		TRANSFEROUTPARAM_SELECT:'1',//下拉列表
		/**
		 * 人工转自动
		 */
		//系统参数：是否可转至多流程，否，只能转至一个叶子节点或者枝节点
		SYS_CANNOT_TRANS_TO_MANY:"0",
		//系统参数：是否可转至多流程，是
		SYS_CAN_TRANS_TO_MANY:"1",
		//系统参数：多流程下，是否可转至枝节点，否
		SYS_CANNOT_TRANS_TO_BRANCH_NODE:"0",
		//系统参数：多流程下，是否可转至枝节点，是
		SYS_CAN_TRANS_TO_BRANCH_NODE:"1",
		//系统参数：多流程下，可选择的最大节点数，默认为10
		SYS_MAX_TRANS_LEAF_NODES:"10",
		//系统参数：流程接入码由ACCESSCODE与TRANSFERCODE组成，否
		SYS_TRANSFER_ONLY:"0",
		//系统参数：流程接入码由ACCESSCODE与TRANSFERCODE组成，是
		SYS_ACCESS_AND_TRANSFER:"1",
		//转出设备类型为IVR：3
		CALLED_DEVICE_TYPE_IVR:"3",
		/**
		 * 挂机满意度
		 */
		//003-转IVR满意度调查
		SATISFATYPEID:"003",
		//挂机满意度系统标识
		SATISFASYSTEMFLAG:"1",
		//满意度系统参数moduleId
		SATISF_MODULEID:"102",
		//满意度系统参数cateGoryId
		SATISF_CATEGORYID:"102005",
		//客服代表挂机是否转满意度调查流程ITEMID
		ITEMID_TOSATISFORSTAFF:"102005001",
		//客服代表挂机使用满意度调查方式ITEMID
		ITEMID_SURVEYTYPE:"102005002",
		//是否询问客服代表挂机后是否转语音满意度调查流程ITEMID
		ITEMID_ASKFORSTAFF:"102005003",
		//客服代表挂机语音调查模式下，转短信满意度通话时间阈值ITEMID
		ITEMID_SATISTIMEFLAG:"102005004",
		//客服代表IVR释放转是否转满意度调查流程ITEMID
		ITEMID_TOSATISFORIVR:"102005005",
		//用户挂机是否短信转满意度调查流程ITEMID
		ITEMID_TOSATISHANGBYUSER:"102005006",
		//客服代表转指定IVR流程不下发短信满意度ITEMID
		ITEMID_SPECIFICIDOFIVR:"102005007",
		//客服代表转指定队列下发短信满意度ITEMID
		ITEMID_SPECIFICQUEUE:"102005008",
		//客服代表转专席是否下发满意度
		ITEMID_TOSATISFORBOX:"102005009",
		//挂机满意度流程接入码
		ITEMID_ACCESSCODE:"102005010",
		//挂机满意度流程被叫号码的后续码
		ITEMID_TRANSFERCODE:"102005011",
		/**
		 * 密码验证类型
		 */
		//服务密码验证类型 1:服务密码验证 2：身份证验证 3：宽带信息验证
		CIPERCHECK_CIPERCHECK:'1',
		CIPERCHECK_IDINFOCHECK:'2',
		CIPERCHECK_WIDENETCHECK:'3',
		/**
		 * 密码验证结果 0:不通过 1：通过
		 */
		CIPERCHECKRESULT_ACCESS:'1',
		CIPERCHECKRESULT_NOTACCESS:'0',
		/**
		 * 网关接口返回码
		 */
		//CTI互转成功
		CTIMUTUALRETURNCODE_SUCCESS:'00000', 
		//创建会话成功，调用CTI释放会话接口失败
		CTIMUTUALRETURNCODE_CTIFAIL:'00999',
		//无坐席上班，转接失败
		CTIMUTUALRETURNCODE_NOTSEAT:'562',
		//会话不存在
		CTIMUTUALRETURNCODE_NOTDIALOGUE:'02002',
		//没有对应接入码，转接失败
		CTIMUTUALRETURNCODE_NOTACCESS:'567',
		/**
		 * 初始数
		 */
		STARTNUM:100000,
		/**
		 * 微博channelID
		 */
		//中国移动10086微博channelID
		MICROBLOGGING_CH:'090009',
		//中国移动微博channelID
		MICROBLOGGING_CHA:'09a009',
		//CMOS在线微博测试账号channelID
		MICROBLOGGING_CHAL:'099909'
		
	}
});
