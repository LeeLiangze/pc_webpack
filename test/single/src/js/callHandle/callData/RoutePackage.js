define(
	[ '../../index/constants/mediaConstants',
		'./gx/Ext2_GX',
		'./he/Ext1_HE',
		'./he/Ext2_HE' ],
	function(Constants, Ext2_GX, Ext1_HE, Ext2_HE) {
		var fillChar = String.fromCharCode('0000');
		var _index;
		var serviceTypeId;
		var typeArr_Gx = [ Constants.SERVICE_TYPE_GX_ZZ_DEV,
			Constants.SERVICE_TYPE_GX_ZZ_SIT,
			Constants.SERVICE_TYPE_GX_LY_SIT,
			Constants.SERVICE_TYPE_GX_LY_PRD_DEMO,
			Constants.SERVICE_TYPE_GX_LY_PRD ];

		var typeArr_He = [ Constants.SERVICE_TYPE_HE_ZZ_DEV,
			Constants.SERVICE_TYPE_HE_ZZ_SIT,
			Constants.SERVICE_TYPE_HE_LY_SIT,
			Constants.SERVICE_TYPE_HE_LY_PRD ];

		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		var routePackage = function(index) {
			_index = index;
			serviceTypeId = _index.CTIInfo.serviceTypeId;
			this.init();
		};
		routePackage.prototype = {
			init : function() {
				this.bigZone; //大区制标志，1：大区制，0非大区制
				this.cityCode; //呼叫发起地的地市代码（大区制）或者0（非大区制）
				this.userClass; //ServiceNo号码的用户级别
				this.transferFlag; //人工自动互转源设备标志
				this.charLanguage; //语种，=1普通话，=2英语，=3本地话
				this.callerNo; //主叫号码
				this.calleeNo; //被叫号码
				this.serviceNo; //受理号码
				this.userType; //ServiceNo号码的用户品牌
				this.checkPswIvr; //密码验证子流程的IVR接入码
				this.digitCode; //按键路由
				this.keyTrace; //用户的流程按键轨迹
				this.branchTrace; //用户的流程分支轨迹
				this.enterDateTime; //呼叫进入自动业务时间
				this.confirmDateTime; //确认密码时间
				this.delayTime; //数据库操作时延
				this.checkFlag; //是否通过身份验证标志，=1已通过，=0未通过
				this.logFlag; //写日志方式，“1”表示采用旧接口，其他表示采用新接口
				this.localDsn; //客服业务数据源，由主模块从配置文件中获得，传递给子模块。
				this.logDsn; //日志数据源，由子模块从配置表中获得，传递给其他模块。
				this.routFailCounter; //路由人工失败计数器
				this.serialId; //流水号
				this.pathHead; //语音文件路径头
				this.ext1; //预留扩展字段1
				this.ext2; //预留扩展字段2

				this.initExt1(); //初始化扩展字段1
				this.initExt2(); //初始化扩展字段2
			},

			initExt1 : function() {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服

				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					this.setExt1(new Ext1_HE());
				} else {

				}
			},

			initExt2 : function() {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					this.setExt2(new Ext2_GX());
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					this.setExt2(new Ext2_HE());
				} else {

				}
			},

			resetAll : function() {
				this.setBigZone(null);
				this.setCityCode(null);
				this.setUserClass(null);
				this.setTransferFlag(null);
				this.setCharLanguage(null);
				this.setCallerNo(null);
				this.setCalleeNo(null);
				this.setServiceNo(null);
				this.setUserType(null);
				this.setCheckPswIvr(null);
				this.setDigitCode(null);
				this.setKeyTrace(null);
				this.setBranchTrace(null);
				this.setEnterDateTime(null);
				this.setConfirmDateTime(null);
				this.setDelayTime(null);
				this.setCheckFlag(null);
				this.setLogFlag(null);
				this.setLocalDsn(null);
				this.setLogDsn(null);
				this.setRoutFailCounter(null);
				this.setSerialId(null);
				this.setPathHead(null);
				this.resetExt1();
				this.resetExt2();
			},

			resetExt1 : function() {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服

				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					if (this.getExt1()) {
						this.getExt1().resetAll();
					} else {
						this.setExt1(new Ext1_HE());
					}
				} else {

				}
			},

			resetExt2 : function() {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					if (this.getExt2()) {
						this.getExt2().resetAll();
					} else {
						this.setExt2(new Ext2_GX());
					}
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					if (this.getExt2()) {
						this.getExt2().resetAll();
					} else {
						this.setExt2(new Ext2_HE());
					}
				} else {

				}
			},

			splitData : function(data) {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					this.splitExt2Data(data);
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					this.splitBasicData(base64ToBin(data));
				} else {

				}
			},

			splitBasicData : function(Bin) {
				var field01 = Bin.substr(0 * 8, 2 * 8);
				var field02 = Bin.substr(2 * 8, 6 * 8);
				var field03 = Bin.substr(8 * 8, 4 * 8);
				var field04 = Bin.substr(12 * 8, 11 * 8);
				var field05 = Bin.substr(23 * 8, 2 * 8);
				var field06 = Bin.substr(25 * 8, 21 * 8);
				var field07 = Bin.substr(46 * 8, 21 * 8);
				var field08 = Bin.substr(67 * 8, 21 * 8);
				var field09 = Bin.substr(88 * 8, 1 * 8);//整型
				var field10 = Bin.substr(89 * 8, 21 * 8);
				var field11 = Bin.substr(110 * 8, 21 * 8);
				var field12 = Bin.substr(131 * 8, 101 * 8);
				var field13 = Bin.substr(232 * 8, 197 * 8);
				var field14 = Bin.substr(429 * 8, 17 * 8);
				var field15 = Bin.substr(446 * 8, 17 * 8);
				var field16 = Bin.substr(463 * 8, 2 * 8);//整型
				var field17 = Bin.substr(465 * 8, 2 * 8);
				var field18 = Bin.substr(467 * 8, 2 * 8);
				var field19 = Bin.substr(469 * 8, 21 * 8);
				var field20 = Bin.substr(490 * 8, 21 * 8);
				var field21 = Bin.substr(511 * 8, 1 * 8);//整型
				var field22 = Bin.substr(512 * 8, 21 * 8);
				var field23 = Bin.substr(533 * 8, 21 * 8);
				var field24 = Bin.substr(554 * 8, 197 * 8);
				var field25 = Bin.substr(751 * 8, 197 * 8);

				var bigZone = decode(binToBase64(myBinToStr(field01)));
				var cityCode = decode(binToBase64(myBinToStr(field02)));
				var userClass = decode(binToBase64(myBinToStr(field03)));
				var transferFlag = decode(binToBase64(myBinToStr(field04)));
				var charLanguage = decode(binToBase64(myBinToStr(field05)));
				var callerNo = decode(binToBase64(myBinToStr(field06)));
				var calleeNo = decode(binToBase64(myBinToStr(field07)));
				var serviceNo = decode(binToBase64(myBinToStr(field08)));
				var userType = parseInt(field09, 2);
				var checkPswIvr = decode(binToBase64(myBinToStr(field10)));
				var digitCode = decode(binToBase64(myBinToStr(field11)));
				var keyTrace = decode(binToBase64(myBinToStr(field12)));
				var branchTrace = decode(binToBase64(myBinToStr(field13)));
				var enterDateTime = decode(binToBase64(myBinToStr(field14)));
				var confirmDateTime = decode(binToBase64(myBinToStr(field15)));
				if(field16.substr(field16.length-8,8) == '00000000') {
					field16 = field16.substring(0,field16.length-8);
				}
				var delayTime = parseInt(field16, 2);
				var checkFlag = decode(binToBase64(myBinToStr(field17)));
				var logFlag = decode(binToBase64(myBinToStr(field18)));
				var localDsn = decode(binToBase64(myBinToStr(field19)));
				var logDsn = decode(binToBase64(myBinToStr(field20)));
				var routFailCounter = parseInt(field21, 2);
				var serialId = decode(binToBase64(myBinToStr(field22)));
				var pathHead = decode(binToBase64(myBinToStr(field23)));
				var ext1 = decode(binToBase64(myBinToStr(field24)));
				var ext2 = decode(binToBase64(myBinToStr(field25)));

				this.setBigZone(bigZone);
				this.setCityCode(cityCode);
				this.setUserClass(userClass);
				this.setTransferFlag(transferFlag);
				this.setCharLanguage(charLanguage);
				this.setCallerNo(callerNo);
				this.setCalleeNo(calleeNo);
				this.setServiceNo(serviceNo);
				this.setUserType(userType);
				this.setCheckPswIvr(checkPswIvr);
				this.setDigitCode(digitCode);
				this.setKeyTrace(keyTrace);
				this.setBranchTrace(branchTrace);
				this.setEnterDateTime(enterDateTime);
				this.setConfirmDateTime(confirmDateTime);
				this.setDelayTime(delayTime);
				this.setCheckFlag(checkFlag);
				this.setLogFlag(logFlag);
				this.setLocalDsn(localDsn);
				this.setLogDsn(logDsn);
				this.setRoutFailCounter(routFailCounter);
				this.setSerialId(serialId);
				this.setPathHead(pathHead);
				this.splitExt1Data(ext1);
				this.splitExt2Data(ext2);
				console.log(this);
			},

			splitExt1Data : function(data) {
				this.getExt1().splitData(data);
			},

			splitExt2Data : function(data) {
				this.getExt2().splitData(data);
			},

			unitData : function() {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					return this.unitExt2Data();
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					return this.unitBasicData();
				} else {

				}
			},

			unitBasicData : function() {
				var result = '';
				var bigZone = this.getBigZone() ? this.getBigZone() : '';
				var cityCode = this.getCityCode() ? this.getCityCode() : '';
				var userClass = this.getUserClass() ? this.getUserClass()
					: '';
				var transferFlag = this.getTransferFlag() ? this
					.getTransferFlag() : '';
				var charLanguage = this.getCharLanguage() ? this
					.getCharLanguage() : '';
				var callerNo = this.getCallerNo() ? this.getCallerNo() : '';
				var calleeNo = this.getCalleeNo() ? this.getCalleeNo() : '';
				var serviceNo = this.getServiceNo() ? this.getServiceNo()
					: '';
				var userType = this.getUserType() ? this.getUserType() : '';
				var checkPswIvr = this.getCheckPswIvr() ? this
					.getCheckPswIvr() : '';
				var digitCode = this.getDigitCode() ? this.getDigitCode()
					: '';
				var keyTrace = this.getKeyTrace() ? this.getKeyTrace() : '';
				var branchTrace = this.getBranchTrace() ? this
					.getBranchTrace() : '';
				var enterDateTime = this.getEnterDateTime() ? this
					.getEnterDateTime() : '';
				var confirmDateTime = this.getConfirmDateTime() ? this
					.getConfirmDateTime() : '';
				var delayTime = this.getDelayTime() ? this.getDelayTime()
					: '';
				var checkFlag = this.getCheckFlag() ? this.getCheckFlag()
					: '';
				var logFlag = this.getLogFlag() ? this.getLogFlag() : '';
				var localDsn = this.getLocalDsn() ? this.getLocalDsn() : '';
				var logDsn = this.getLogDsn() ? this.getLogDsn() : '';
				var routFailCounter = this.getRoutFailCounter() ? this
					.getRoutFailCounter() : '';
				// Update by Douhongfei ad 0511 Start
				// var serialId = this.getSerialId() ? this.getSerialId() : ''; // origin
				var serialId = this.getSerialId() ? this.getSerialId()
					.substr(0, 20) : '';
				// Update by Douhongfei ad 0511 End
				var pathHead = this.getPathHead() ? this.getPathHead() : '';
				var ext1String = this.unitExt1Data();
				var ext2String = this.unitExt2Data();

				var bigZone1 = myChangeBin(base64ToBin(encode(bigZone)), 2);
				var cityCode1 = myChangeBin(base64ToBin(encode(cityCode)),
					6);
				var userClass1 = myChangeBin(
					base64ToBin(encode(userClass)), 4);
				var transferFlag1 = myChangeBin(
					base64ToBin(encode(transferFlag)), 11);
				var charLanguage1 = myChangeBin(
					base64ToBin(encode(charLanguage)), 2);
				var callerNo1 = myChangeBin(base64ToBin(encode(callerNo)),
					21);
				var calleeNo1 = myChangeBin(base64ToBin(encode(calleeNo)),
					21);
				var serviceNo1 = myChangeBin(
					base64ToBin(encode(serviceNo)), 21);
				var userType1 = dealNumber(userType, '1');
				var checkPswIvr1 = myChangeBin(
					base64ToBin(encode(checkPswIvr)), 21);
				var digitCode1 = myChangeBin(
					base64ToBin(encode(digitCode)), 21);
				var keyTrace1 = myChangeBin(base64ToBin(encode(keyTrace)),
					101);
				var branchTrace1 = myChangeBin(
					base64ToBin(encode(branchTrace)), 197);
				var enterDateTime1 = myChangeBin(
					base64ToBin(encode(enterDateTime)), 17);
				var confirmDateTime1 = myChangeBin(
					base64ToBin(encode(confirmDateTime)), 17);
				var delayTime1 = dealNumber(delayTime, '2');
				var checkFlag1 = myChangeBin(
					base64ToBin(encode(checkFlag)), 2);
				var logFlag1 = myChangeBin(base64ToBin(encode(logFlag)), 2);
				var localDsn1 = myChangeBin(base64ToBin(encode(localDsn)),
					21);
				var logDsn1 = myChangeBin(base64ToBin(encode(logDsn)), 21);
				var routFailCounter1 = dealNumber(routFailCounter, '1');
				var serialId1 = myChangeBin(base64ToBin(encode(serialId)),
					21);
				var pathHead1 = myChangeBin(base64ToBin(encode(pathHead)),
					21);
				var ext11 = myChangeBin(base64ToBin(encode(ext1String)), 197);
				var ext21 = myChangeBin(base64ToBin(encode(ext2String)), 197);

				var total = bigZone1 + cityCode1 + userClass1
					+ transferFlag1 + charLanguage1 + callerNo1
					+ calleeNo1 + serviceNo1 + userType1 + checkPswIvr1
					+ digitCode1 + keyTrace1 + branchTrace1
					+ enterDateTime1 + confirmDateTime1 + delayTime1
					+ checkFlag1 + logFlag1 + localDsn1 + logDsn1
					+ routFailCounter1 + serialId1 + pathHead1 + ext11
					+ ext21;

				var totalToBase64 = binToBase64(total);
				return totalToBase64;
			},

			unitExt1Data : function() {
				return this.getExt1().unitData();
			},

			unitExt2Data : function() {
				return this.getExt2().unitData();
			},

			setValueFromParam : function(ext2Param, callingInfo) {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					this.setExt2FromParam(ext2Param, callingInfo);
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					this.setBasicFromParam(ext2Param, callingInfo);
				} else {

				}
			},

			setBasicFromParam : function(ext2Param, callingInfo) {
				var transferFlg = "IVRICDSC";
				var digitCode = "";
				var serviceNo = callingInfo.getSubsNumber();
				var serialId = callingInfo.getSerialNo();
				var ext1Param = {
					"field09" : _index.getUserInfo().staffId,
					"field21" : callingInfo.getContactId()
				}
				switch (ext2Param.typeId) {
					case "9001": // 二次确认 1m
						digitCode = '1m';
						break;
					case "9002": // 身份证鉴权 1n
						digitCode = '1n';
						break;
					case "0001": // 密码验证 1a
						digitCode = '1a';
						break;
					case "0002": // 满意度 1b
						digitCode = '1b';
						break;
					case "2000": // 转多知识点
						transferFlg = "IVRICDSCM";
						break;
					default:
						break;
				}

				this.setTransferFlag(transferFlg);
				this.setServiceNo(serviceNo);
				this.setDigitCode(digitCode);
				this.setSerialId(serialId);
				this.setExt1FromParam(ext1Param);
				this.setExt2FromParam(ext2Param, callingInfo);
			},

			setExt1FromParam : function(ext1Param) {
				this.getExt1().setValueFromParam(ext1Param);
			},

			setExt2FromParam : function(ext2Param, callingInfo) {
				// 添加逻辑转队列/转工号判断逻辑
				if (ext2Param && ext2Param.typeId == "0004") {
					var subsNumber = callingInfo.getSubsNumber();
					var _custInfo = callingInfo
						.getClientInfoMap(subsNumber);
					var userName = _custInfo ? _custInfo.userName ? _custInfo.userName
						: ""
						: "";
					var isOutCall = callingInfo.getCallType() == "1" ? true
						: false;
					var operId = "";
					if (ext2Param.transferFlg == "2") {
						operId = "001";
					} else if (ext2Param.transferFlg == "0") {
						operId = "002";
					}
					var extraParam = {
						"serialNo" : callingInfo.getSerialNo(),
						"contactId" : callingInfo.getContactId(),
						"staffId" : _index.getUserInfo().staffId,
						"staffName" : _index.getUserInfo()['staffName'],
						"workNo" : _index.CTIInfo.workNo,
						"mediaId" : callingInfo.getMediaType(),
						"channelId" : callingInfo.getChannelID(),
						"userName" : userName,
						"subsNumber" : subsNumber,
						"transFlag" : true,
						"isOutCall" : isOutCall,
						"operId" : operId,
						"status" : "1"
					}
					$.extend(ext2Param, extraParam);
				}
				this.getExt2().setValueFromParam(ext2Param);
			},

			// 外呼时设置随路数据
			setValueAtCallOut : function(ext2Param, callingInfo) {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					this.setExt2FromParam(ext2Param, callingInfo);
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					this.setBasicAtCallOut(ext2Param, callingInfo);
				} else {

				}
			},

			setBasicAtCallOut : function(ext2Param, callingInfo) {
				var transferFlg = "IVRICDOUT";
				var digitCode = "";
				var subsNumber = callingInfo.getSubsNumber();
				var _custInfo = callingInfo.getClientInfoMap(subsNumber);
				var cityCode = _custInfo ? _custInfo.cityCode ? _custInfo.cityCode
					: ""
					: "";
				var userClass = _custInfo ? _custInfo.userClass ? _custInfo.userClass
					: ""
					: "";
				var serialNo = callingInfo.getSerialNo();
				var ext1Param = {
					"field09" : _index.getUserInfo().staffId,
					"field21" : callingInfo.getContactId(),
					"field22" : serialNo
				}
				switch (ext2Param.typeId) {
					case "9001": // 二次确认 1m
						digitCode = '1m';
						break;
					case "9002": // 身份证鉴权 1n
						digitCode = '1n';
						break;
					case "0001": // 密码验证 1a
						digitCode = '1a';
						break;
					case "0002": // 满意度 1b
						digitCode = '1b';
						break;
					case "2000": // 转多知识点
						transferFlg = "IVRICDOUTM";
						break;
					default:
						break;
				}

				this.setBigZone("1"); // 固定值"1"
				this.setCityCode(cityCode); // 根据客户信息获取
				this.setUserClass(userClass); // 根据客户信息获取
				this.setTransferFlag(transferFlg); // IVRICDOUT：源设备为座席，且外呼转自动; IVRICDOUTM：源设备为座席，且外呼多知识点转自动
				this.setCharLanguage("1"); // 固定值"1"
				this.setCallerNo(subsNumber); // 坐席外呼的用户号码
				this.setCalleeNo("10086"); // 固定值"10086"
				this.setServiceNo(subsNumber); // 实际受理号码
				// 整型
				this.setUserType("1"); // 固定值"1"
				this.setCheckPswIvr("4098"); // 固定值"4098"
				this.setDigitCode(digitCode); // 转密码验证 1a 转满意度调查 1b 身份证鉴权  1n 业务办理二次确认  1m
				this.setKeyTrace(digitCode); // 同digitCode
				this.setBranchTrace(digitCode); // 同digitCode
				this.setEnterDateTime(this.getCurrentTime()); // 取当前时间 2017031417:00:26
				this.setConfirmDateTime(""); // 空
				// 整型
				this.setDelayTime("30"); // 30
				this.setCheckFlag("0"); // 默认值"0",受理号码不一致时，需要修改成"0"
				this.setLogFlag("0"); // 0
				this.setLocalDsn("icd186"); // icd186
				this.setLogDsn("icd186"); // icd186
				// 整型
				this.setRoutFailCounter("1"); // 1
				this.setSerialId(serialNo); // 呼叫流水号
				this.setPathHead("F:\\VOICE"); // F:\VOICE
				this.setExt1AtCallOut(ext1Param); // 1~0~~~0~0~NO~~~263~0~~0~0~~1~1~1~1~1~~1703140100561516~1703140103594486~1
				this.setExt2FromParam(ext2Param, callingInfo); // 按照业务传参
			},

			setExt1AtCallOut : function(ext1Param) {
				this.getExt1().setValueAtCallOut(ext1Param);
			},

			setCallingInfo : function(callingInfo) {
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					this.getExt2().setCallingInfo(callingInfo);
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					// 键轨迹keyTrace
					if (!this.isEmpty(this.getKeyTrace())) {
						callingInfo.setKeyTrace(this.getKeyTrace());
					}
					// 流程轨迹branchTrace
					if (!this.isEmpty(this.getBranchTrace())) {
						callingInfo.setBranchTrace(this.getBranchTrace());
					}
				} else {

				}
			},

			getValidateResult : function() {
				var result = null;
				if ($.inArray(serviceTypeId, typeArr_Gx) > -1) { // 广西客服
					result = this.getExt2().getValidateResult();
				} else if ($.inArray(serviceTypeId, typeArr_He) > -1) { // 河北客服
					result = this.getExt2().getValidateResult();
				} else {

				}
				return result;
			},

			//1
			setBigZone : function(bigZone) {
				this.bigZone = bigZone;
			},
			getBigZone : function() {
				return this.bigZone;
			},
			//2
			setCityCode : function(cityCode) {
				this.cityCode = cityCode;
			},
			getCityCode : function() {
				return this.cityCode;
			},
			//3
			setUserClass : function(userClass) {
				this.userClass = userClass;
			},
			getUserClass : function() {
				return this.userClass;
			},
			//4
			setTransferFlag : function(transferFlag) {
				this.transferFlag = transferFlag;
			},
			getTransferFlag : function() {
				return this.transferFlag;
			},
			//5
			setCharLanguage : function(charLanguage) {
				this.charLanguage = charLanguage;
			},
			getCharLanguage : function() {
				return this.charLanguage;
			},
			//6
			setCallerNo : function(callerNo) {
				this.callerNo = callerNo;
			},
			getCallerNo : function() {
				return this.callerNo;
			},
			//7
			setCalleeNo : function(calleeNo) {
				this.calleeNo = calleeNo;
			},
			getCalleeNo : function() {
				return this.calleeNo;
			},
			//8
			setServiceNo : function(serviceNo) {
				this.serviceNo = serviceNo;
			},
			getServiceNo : function() {
				return this.serviceNo;
			},
			//9
			setUserType : function(userType) {
				this.userType = userType;
			},
			getUserType : function() {
				return this.userType;
			},
			//10
			setCheckPswIvr : function(checkPswIvr) {
				this.checkPswIvr = checkPswIvr;
			},
			getCheckPswIvr : function() {
				return this.checkPswIvr;
			},
			//11
			setDigitCode : function(digitCode) {
				this.digitCode = digitCode;
			},
			getDigitCode : function() {
				return this.digitCode;
			},
			//12
			setKeyTrace : function(keyTrace) {
				this.keyTrace = keyTrace;
			},
			getKeyTrace : function() {
				return this.keyTrace;
			},
			//13
			setBranchTrace : function(branchTrace) {
				this.branchTrace = branchTrace;
			},
			getBranchTrace : function() {
				return this.branchTrace;
			},
			//14
			setEnterDateTime : function(enterDateTime) {
				this.enterDateTime = enterDateTime;
			},
			getEnterDateTime : function() {
				return this.enterDateTime;
			},
			//15
			setConfirmDateTime : function(confirmDateTime) {
				this.confirmDateTime = confirmDateTime;
			},
			getConfirmDateTime : function() {
				return this.confirmDateTime;
			},
			//16
			setDelayTime : function(delayTime) {
				this.delayTime = delayTime;
			},
			getDelayTime : function() {
				return this.delayTime;
			},
			//17
			setCheckFlag : function(checkFlag) {
				this.checkFlag = checkFlag;
			},
			getCheckFlag : function() {
				return this.checkFlag;
			},
			//18
			setLogFlag : function(logFlag) {
				this.logFlag = logFlag;
			},
			getLogFlag : function() {
				return this.logFlag;
			},
			//19
			setLocalDsn : function(localDsn) {
				this.localDsn = localDsn;
			},
			getLocalDsn : function() {
				return this.localDsn;
			},
			//20
			setLogDsn : function(logDsn) {
				this.logDsn = logDsn;
			},
			getLogDsn : function() {
				return this.logDsn;
			},
			//21
			setRoutFailCounter : function(routFailCounter) {
				this.routFailCounter = routFailCounter;
			},
			getRoutFailCounter : function() {
				return this.routFailCounter;
			},
			//22
			setSerialId : function(serialId) {
				this.serialId = serialId;
			},
			getSerialId : function() {
				return this.serialId;
			},
			//23
			setPathHead : function(pathHead) {
				this.pathHead = pathHead;
			},
			getPathHead : function() {
				return this.pathHead;
			},
			//24
			setExt1 : function(ext1) {
				this.ext1 = ext1;
			},
			getExt1 : function() {
				return this.ext1;
			},
			//25
			setExt2 : function(ext2) {
				this.ext2 = ext2;
			},
			getExt2 : function() {
				return this.ext2;
			},

			getCurrentTime : function() {
				var currentTime = _index.utilJS.getCurrentTime();
				currentTime = currentTime.replace(/-/g, '')
					.replace(' ', '');
				return currentTime;
			},

			isEmpty : function(value) {
				var value = this.trim(value);
				var result = false;
				if (value == null || value == undefined || value == "") {
					result = true;
				}
				return result;
			},
			trim : function(str) {
				var result;
				if (Object.prototype.toString.call(str) === "[object String]") {
					result = str.replace(/(^\s*)|(\s*$)/g, "");
				} else {
					result = str;
				}
				return result;
			}
		}

		function base64ToBin(str) {
			var bitString = "";
			var tail = 0;
			for (var i = 0; i < str.length; i++) {
				if (str.charAt(i) != "=") {
					var decode = code.indexOf(str.charAt(i)).toString(2);
					bitString += (new Array(7 - decode.length)).join("0")
						+ decode;
				} else {
					tail++;
				}
			}
			return bitString.substr(0, bitString.length - tail * 2);
		}

		function myBinToStr(bin) {
			var result = "";
			for (var i = 0; i < bin.length; i += 8) {
				if (bin.substr(i, 8) == '00000000') {
					break;
				} else {
					//result += String.fromCharCode(parseInt(bin.substr(i, 8), 2));
					result += bin.substr(i, 8);
				}
			}
			return result;
		}

		var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
			.split(""); //索引表

		function binToBase64(bitString) {
			var result = "";
			var tail = bitString.length % 6;
			var bitStringTemp1 = bitString.substr(0, bitString.length
				- tail);
			var bitStringTemp2 = bitString.substr(bitString.length - tail,
				tail);
			for (var i = 0; i < bitStringTemp1.length; i += 6) {
				var index = parseInt(bitStringTemp1.substr(i, 6), 2);
				result += code[index];
			}
			bitStringTemp2 += new Array(7 - tail).join("0");
			if (tail) {
				result += code[parseInt(bitStringTemp2, 2)];
				result += new Array((6 - tail) / 2 + 1).join("=");
			}
			return result;
		}

		function encode(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = _utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output + _keyStr.charAt(enc1)
					+ _keyStr.charAt(enc2) + _keyStr.charAt(enc3)
					+ _keyStr.charAt(enc4);
			}
			return output;
		}

		function decode(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		}

		var _utf8_encode = function(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}
			return utftext;
		};

		// private method for UTF-8 decoding
		var _utf8_decode = function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while (i < utftext.length) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6)
						| (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		};

		function myChangeBin(s, len) {
			var result = s
				+ new Array(len - (s.length / 8) + 1).join('00000000');
			return result;
		}

		function dealNumber(num, byteNum) {
			var result = '';
			var charCode = parseInt(num).toString(2);
			if (byteNum == '1') {
				result += (new Array(9 - charCode.length).join("0") + charCode);
			} else if (byteNum == '2') {
				if(charCode.length < 9) {
					result += (new Array(9 - charCode.length).join("0") + charCode) + (new Array(9).join("0"));
				} else {
					result += (new Array(17 - charCode.length).join("0") + charCode);
				}
			}
			return result;
		}
		return routePackage;
	});