define(
		[ 
		  'Util',
		  '../callData/RoutePackage',
		'../callData/gx/Ext2_GX',
		'../callData/gx/Ext2_GX_Ext2Data',
		'../callData/yn/Ext2_YN',
		'../util/base64', 
		'../../index/constants/mediaConstants'
		],
		function(Util, RoutePackage, Ext2_GX, Ext2_GX_Data, Ext2_YN, Base64, Constants) {
			var serviceTypeId;
			var accessCodeStructure = '0';
			var base64 = new Base64();
			var routePackage;
			var typeArr_Gx = [
			                  Constants.SERVICE_TYPE_GX_ZZ_DEV,
			                  Constants.SERVICE_TYPE_GX_ZZ_SIT,
			                  Constants.SERVICE_TYPE_GX_LY_SIT,
			                  Constants.SERVICE_TYPE_GX_LY_PRD_DEMO,
			                  Constants.SERVICE_TYPE_GX_LY_PRD
			                  ];

			var utils = function(options) {
				this._index = options;
				serviceTypeId = this._index.CTIInfo.serviceTypeId;
				
				$.getJSON("../../../data/callHandle/accessCodeStructure.json",{"itemId":"102004001"},function(jsonData,status){
					if(status){
						accessCodeStructure = jsonData.bean.value;
					}
				},true);
			}
			utils.prototype = {
				/**
				 * 根据省份不同，初始化不同的routePackage对象
				 * 
				 */
				initRoutePackage : function() {
					if ($.inArray(serviceTypeId,typeArr_Gx) > -1) { // 广西客服
						if (routePackage) {
							routePackage.init();
							if (routePackage.getExt2()) {
								routePackage.getExt2().init();
								if(routePackage.getExt2().getExt2Data()) {
									routePackage.getExt2().getExt2Data().init();
								} else {
									routePackage.getExt2().setExt2Data(new Ext2_GX_Data());
								}
							} else {
								routePackage.setExt2(new Ext2_GX());
							}
						} else {
							routePackage = new RoutePackage();
							routePackage.setExt2(new Ext2_GX());
							routePackage.getExt2().setExt2Data(new Ext2_GX_Data());
						}
					} else if (serviceTypeId == Constants.SERVICE_TYPE_YN) { // 云南客服
						if (routePackage) {
							routePackage.init();
							if (routePackage.getExt1()) {
								routePackage.setExt1(null);
							}
							if (routePackage.getExt2()) {
								routePackage.getExt2().init();
							} else {
								routePackage.setExt2(new Ext2_YN());
							}
						} else {
							routePackage = new RoutePackage();
							routePackage.setExt2(new Ext2_YN());
						}
					} else {

					}
					return routePackage;
				},

				/**
				 * 获取当前routePackage
				 */
				getRoutePackage : function() {
					return routePackage;
				},

				/**
				 * 获取呼叫数据、base64解密、拆分到RoutePackage对象中，并把有用信息放到callingInfo中
				 */
				getDataAndSplitToRoutePackage : function(callId,initFlg,callback) {
					if(initFlg) {
						this.initRoutePackage();
					}
					// 获取随路数据
					this.queryCallData(callId,initFlg,callback);
				},
				/**
				 * 记录日志
				 */
				writeRoutPackageLog : function(routePackage) {

				},
				/**
				 * 调用CTI接口获取呼叫数据
				 */
				queryCallData : function(callId,initFlg,callback) {
					var resultData = null;
					// 调用CTI接口--获取呼叫数据
					var isDefault=this._index.CTIInfo.isDefault;//缺省业务标志值
			        var proxyIp=this._index.CTIInfo.ProxyIP;//代理ip
			        var proxyPort =this._index.CTIInfo.ProxyPort;//代理端口
			        var ctiId=this._index.CTIInfo.CTIId; //ctiId
			        var ip=this._index.CTIInfo.IP;//直连ip
			        var port=this._index.CTIInfo.port;//直连端口
			        var sign_url="";
			        if(isDefault=="1"){//此种情况走nginx代理
			        	 sign_url=Constants.CCACSURL+proxyIp+":"+proxyPort+"/ccacs/"+ctiId+"/ws/call/querycalldata";
			        }else{                                
			        	 sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/querycalldata"; //跨域直连
			        }
					var data = {
						opserialNo : this._index.serialNumber.getSerialNumber(),
						callId : callId,
						isEncodeResult : false
					}
					var that = this;
					if(this._index.queue.browserName==="IE"){
						$.ajax({
							url : sign_url,
							type : 'post',
							async : true,
							data : JSON.stringify(data),
							crossDomain : true,
//							xhrFields : {
//								withCredentials : true
//							},
							contentType : "application/json; charset=utf-8",
							success : function(json) {
								// 获取callFeature的值
								if (json.result == "0") {
									// 记录日志
									console.log("获取呼叫数据成功！");
									resultData = json.callData;
									if(resultData) {
										// base64解码
										//var decodedCallData = that.base64Decode(resultData);
										// 拆分呼叫数据,封装routePackage对象
										that.splitCallData(resultData);
										// 将routePackage对象放入RoutePackageMap中
										var activeCallId = "" + callId.time + callId.dsn + callId.handle + callId.server;
										that._index.routePackageMap.setActiveCallId(activeCallId);
										that._index.routePackageMap.putRp(activeCallId, routePackage);
										// 更新callingInfo
										setTimeout($.proxy(function(e) {
											this.setRouteAfterSplitCallData(routePackage,initFlg);
										}, that), 200);
										if(typeof callback === "function") {
											callback(that._index);
										}
									}
								} else {
									// 记录日志
									console.log("获取呼叫数据失败！");
								}
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								var errorParams = {
									"XMLHttpRequest" : XMLHttpRequest,
									"textStatus" : textStatus,
									"errorThrown" : errorThrown
								};
							}
						});
					} else {
						$.ajax({
							url : sign_url,
							type : 'post',
							async : true,
							data : JSON.stringify(data),
							crossDomain : true,
							xhrFields : {
								withCredentials : true
							},
							contentType : "application/json; charset=utf-8",
							success : function(json) {
								// 获取callFeature的值
								if (json.result == "0") {
									// 记录日志
									console.log("获取呼叫数据成功！");
									resultData = json.callData;
									if(resultData) {
										// base64解码
										//var decodedCallData = that.base64Decode(resultData);
										// 拆分呼叫数据,封装routePackage对象
										that.splitCallData(resultData);
										// 将routePackage对象放入RoutePackageMap中
										var activeCallId = "" + callId.time + callId.dsn + callId.handle + callId.server;
										that._index.routePackageMap.setActiveCallId(activeCallId);
										that._index.routePackageMap.putRp(activeCallId, routePackage);
										// 更新callingInfo
										setTimeout($.proxy(function(e) {
											this.setRouteAfterSplitCallData(routePackage,initFlg);
										}, that), 200);
										if(typeof callback === "function") {
											callback(that._index);
										}
									}
								} else {
									// 记录日志
									console.log("获取呼叫数据失败！");
								}
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								var errorParams = {
									"XMLHttpRequest" : XMLHttpRequest,
									"textStatus" : textStatus,
									"errorThrown" : errorThrown
								};
							}
						});
					}
				},
				/**
				 * 拆分呼叫数据到routePackage对象
				 */
				splitCallData : function(data) {
					var tmpRoutePackage = this.splitBasicData(data);
					if ($.inArray(serviceTypeId,typeArr_Gx) > -1) { // 广西客服
						if (tmpRoutePackage.tmpExt2) {
							this.splitExt2Data(tmpRoutePackage.tmpExt2);
						}
					} else if (serviceTypeId == Constants.SERVICE_TYPE_YN) { // 云南客服
						if (tmpRoutePackage.tmpExt2) {
							this.splitExt2Data(tmpRoutePackage.tmpExt2);
						}
					}
				},
				/**
				 * 拆分基本字段，广西暂不需要
				 */
				splitBasicData : function(data) {
					var dealedData = this.trim(data);
					if ($.inArray(serviceTypeId,typeArr_Gx) > -1) { // 广西客服
						return {
							tmpExt2 : dealedData
						};
					} else if (serviceTypeId == Constants.SERVICE_TYPE_YN) { //云南客服
						var resultData = routePackage.splitData(dealedData,serviceTypeId);
						return resultData;
					}
				},

				/**
				 * 调用省端接口，拆分扩展字段2
				 */
				splitExt2Data : function(data) {
					routePackage.getExt2().splitData(data);
				},

				/**
				 * 将有用数据保存至callingInfo中
				 */
				setRouteAfterSplitCallData : function(routePackage,initFlg) {
					if(initFlg) {
						var activeSerialNo = this._index.CallingInfoMap.getActiveSerialNo();
						var callingInfo = this._index.CallingInfoMap.get(activeSerialNo);
						if(activeSerialNo == undefined || callingInfo == undefined || activeSerialNo == null || callingInfo == null) {
							return;
						}
						// typeId
						// callId
						// 话务轨迹callTrace
						
						// 主叫号码routePackage.callerNo = callingInfo.callerNo
						if (!this.isEmpty(routePackage.getExt2().getCallerNo())) {
							callingInfo.setCallerNo(routePackage.getExt2()
									.getCallerNo());
							callingInfo.setSubsNumber(routePackage.getExt2()
									.getCallerNo());
						}
						
						// 客户品牌ID custBrandId
						
						// 被叫号码routePackage.calledNo = callingInfo.calledNo
						if (!this.isEmpty(routePackage.getExt2().getCalledNo())) {
							callingInfo.setCalledNo(routePackage.getExt2()
									.getCalledNo());
						}
						
						// 技能队列名routePackage.skillName = callingInfo.skillDesc
						if (!this.isEmpty(routePackage.getExt2().getSkillName())) {
							callingInfo.setSkillDesc(routePackage.getExt2()
									.getSkillName());
						}
						
						// 节点ID nodeId
						
						// 键轨迹keyTrace
						if (!this.isEmpty(routePackage.getExt2().getKeyTrace())) {
							callingInfo.setKeyTrace(routePackage.getExt2()
									.getKeyTrace());
						}
						
						// 业务号码routePackage.subsNumber = callingInfo.subsNumber
						/*
						if (!this.isEmpty(routePackage.getExt2().getSubsNumber())) {
							callingInfo.setSubsNumber(routePackage.getExt2()
									.getSubsNumber());
						}
						*/
						
						// 坐席工号workNo
						
						// 呼叫端口callPort
					}
				},

				/**
				 * 合并呼叫数据
				 */
				unitCallData : function(routePackage) {
					var ext1String = null;
					var ext2String = null;
					if ($.inArray(serviceTypeId,typeArr_Gx) > -1) { // 广西客服
						ext2String = this.unitExt2Data();
					} else if (serviceTypeId == Constants.SERVICE_TYPE_YN) { // 云南客服
						ext1String = routePackage.getExt1();
						ext2String = this.unitExt2Data();
					}
					var dealedCallData = this.unitBasicData(ext1String, ext2String);
					return dealedCallData;
				},

				/**
				 * 合并扩展字段2
				 */
				unitExt2Data : function() {
					var dealedExt2Data = routePackage.getExt2().unitData();
					return dealedExt2Data;
				},
				/**
				 * 合并基本字段
				 */
				unitBasicData : function(ext1String, ext2String) {
					var dealedCallData = null;
					if ($.inArray(serviceTypeId,typeArr_Gx) > -1) { // 广西客服
						dealedCallData = ext2String;
					} else if (serviceTypeId == Constants.SERVICE_TYPE_YN) { // 云南客服
						dealedCallData = routePackage.unitData(ext1String, ext2String, serviceTypeId);
					}
					return dealedCallData;
				},
				/**
				 * 调用cti接口，设置呼叫数据
				 */
				setCallData : function(callId, callData, isDataEncoded) {
					var result = null;
					var isDefault=this._index.CTIInfo.isDefault;//缺省业务标志值
			        var proxyIp=this._index.CTIInfo.ProxyIP;//代理ip
			        var proxyPort =this._index.CTIInfo.ProxyPort;//代理端口
			        var ctiId=this._index.CTIInfo.CTIId; //ctiId
			        var ip=this._index.CTIInfo.IP;//直连ip
			        var port=this._index.CTIInfo.port;//直连端口
			        var sign_url="";
			        if(isDefault=="1"){//此种情况走nginx代理
			        	 sign_url=Constants.CCACSURL+proxyIp+":"+proxyPort+"/ccacs/"+ctiId+"/ws/call/setcalldata";
			        }else{                                
			        	 sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/setcalldata"; //跨域直连
			        }
					var data = {
						"opserialNo" : this._index.serialNumber.getSerialNumber(),
						"callId" : callId,
						"callData" : callData,
						"isDataEncoded" : isDataEncoded
					};
					if(this._index.queue.browserName==="IE"){
						$.ajax({
							url : sign_url,
							type : 'post',
							async : false,
							data : JSON.stringify(data),
							crossDomain : true,
//							xhrFields : {
//								withCredentials : true
//							},
							contentType : "application/json; charset=gbk",
							success : function(json) {
								// 获取callFeature的值
								if (json.result == "0") {
									// 记录日志
									console.log("设置呼叫数据成功");
								} else {
									// 记录日志
									console.log("设置呼叫数据失败");
								}
								result = json.result;
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								var errorParams = {
									"XMLHttpRequest" : XMLHttpRequest,
									"textStatus" : textStatus,
									"errorThrown" : errorThrown
								}
							}
						});
					}else{
						$.ajax({
							url : sign_url,
							type : 'post',
							async : false,
							data : JSON.stringify(data),
							crossDomain : true,
							xhrFields : {
								withCredentials : true
							},
							contentType : "application/json; charset=gbk",
							success : function(json) {
								// 获取callFeature的值
								if (json.result == "0") {
									// 记录日志
									console.log("设置呼叫数据成功");
								} else {
									// 记录日志
									console.log("设置呼叫数据失败");
								}
								result = json.result;
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								var errorParams = {
									"XMLHttpRequest" : XMLHttpRequest,
									"textStatus" : textStatus,
									"errorThrown" : errorThrown
								}
							}
						});
					}

					return result;
				},
				/**
				 * 转IVR前设置路由数据并转出
				 * 
				 * @param transType
				 *            转移模式， 0表示释放转，1表示挂起转
				 * @param transParam
				 *            object 转移参数对象
				 */
				setCallDataAndTransIvr : function(transType, accessCode,
						transferCode, transferParam) {
					var setCallDataResult = "-1"; 
					var result = "-1";
					var activeSerialNo = this._index.CallingInfoMap.getActiveSerialNo();
					var callingInfo = this._index.CallingInfoMap.get(activeSerialNo);
					// 1、封装routePackage对象
					var dealedRoutePackage = this.setRouteBeforeUniteData(
							transType, transferParam, callingInfo);
					// 2、合并呼叫数据(包括调用省端接口、设置ext1/ext2、转routePackage为指定格式 )
					var unitedCallData = this.unitCallData(dealedRoutePackage);
					if (unitedCallData) {
						// 4、调用CTI接口设置呼叫数据
						var time = callingInfo.getCallIdTime();
						var dsn = callingInfo.getCallIdDsn();
						var handle = callingInfo.getCallIdHandle();
						var server = callingInfo.getCallIdServer();
						var callId = {
							"time" : time,
							"dsn" : dsn,
							"handle" : handle,
							"server" : server
						};
						//var encodedCallData = this.base64Encode(unitedCallData);
						console.log(unitedCallData);
						setCallDataResult = this.setCallData(callId, unitedCallData, false);
						if(setCallDataResult == '0') {
							result = this.transferOut(callId, transType, accessCode, transferCode);
						} else {
							return setCallDataResult;
						}
					}
					return result;
				},
				/**
				 * 转IVR前设置路由数据不转出，主要供转接专席模块调用
				 * 
				 * @param transType
				 *            转移模式， 0表示释放转，1表示挂起转
				 * @param transParam
				 *            object 转移参数对象
				 */
				setCallDataForSpecialSeat : function(transType, transferParam) {
					var setCallDataResult = "-1";
					var activeSerialNo = this._index.CallingInfoMap.getActiveSerialNo();
					var callingInfo = this._index.CallingInfoMap.get(activeSerialNo);
					// 1、封装routePackage对象
					var dealedRoutePackage = this.setRouteBeforeUniteData(
							transType, transferParam, callingInfo);
					// 2、合并呼叫数据(包括调用省端接口、设置ext1/ext2、转routePackage为指定格式 )
					var unitedCallData = this.unitCallData(dealedRoutePackage);
					if (unitedCallData) {
						// 4、调用CTI接口设置呼叫数据
						var time = callingInfo.getCallIdTime();
						var dsn = callingInfo.getCallIdDsn();
						var handle = callingInfo.getCallIdHandle();
						var server = callingInfo.getCallIdServer();
						var callId = {
							"time" : time,
							"dsn" : dsn,
							"handle" : handle,
							"server" : server
						};
						//var encodedCallData = this.base64Encode(unitedCallData);
						console.log(unitedCallData);
						setCallDataResult = this.setCallData(callId, unitedCallData, false);
					}
					return setCallDataResult;
				},
				/**
				 * 合并数据前向routePackage里填充需要传输给IVR的字段
				 * 
				 * @param transType
				 *            转移模式， 0表示释放转，1表示挂起转
				 * @param transParam
				 *            object 转移参数对象
				 */
				setRouteBeforeUniteData : function(transType, transferParam, callingInfo) {
					var activeCallId = callingInfo.getCallId();
					if (activeCallId == this._index.routePackageMap.getActiveCallId()) {
						routePackage = this._index.routePackageMap
								.getRp(activeCallId);
					} else {
						this.initRoutePackage();
					}
					if (!this.isEmpty(transType)) {
						// 设置转移方式
						callingInfo.setTransferMode(transType);
						// 转满意度调查挂机方为业务代表挂机，其他挂机方为转IVR挂机
						if (transType == Constants.TRANSFERMODE_RELEASE) {
							if (transferParam.typeId == Constants.TYPE_ID_USERSATISFY) {
								callingInfo
										.setReleaseType(Constants.RELEASETYPE_USER);
							} else {
								callingInfo
										.setReleaseType(Constants.RELEASETYPE_TRANSFER_IVR);
							}
						}
					}
					// 如果为呼出情况
					if (callingInfo.callType == "1") {
						this.setDataCallOutTransToIVR(transType, transferParam);
					}
					// 外呼是否也要设置ext2中的字段？
					// 1 typeId
					if (!this.isEmpty(transferParam.typeId)) {
						routePackage.getExt2().setTypeId(transferParam.typeId);
					}
					// 2 subsNumber
					if (!this.isEmpty(transferParam.subsNumber)) {
						routePackage.getExt2().setSubsNumber(
								transferParam.subsNumber);
					}
					// 3 transferWorkNo
					if (!this.isEmpty(transferParam.transferWorkNo)) {
						routePackage.getExt2().setTransferWorkNo(
								transferParam.transferWorkNo);
					}
					// 4 transferMsg
					if (!this.isEmpty(transferParam.transferMsg)) {
						routePackage.getExt2().setTransferMsg(
								transferParam.transferMsg);
					}
					// 5 callId
					if (!this.isEmpty(transferParam.callId)) {
						routePackage.getExt2().setCallId(transferParam.callId);
					}
					// 6 callerNo
					if (!this.isEmpty(transferParam.callerNo)) {
						routePackage.getExt2().setCallerNo(
								transferParam.callerNo);
					}
					// 7 oriSkillId
					if (!this.isEmpty(transferParam.oriSkillId)) {
						routePackage.getExt2().setOriSkillId(
								transferParam.oriSkillId);
					}
					// 8 oriSkillName
					if (!this.isEmpty(transferParam.oriSkillName)) {
						routePackage.getExt2().setOriSkillName(
								transferParam.oriSkillName);
					}
					// 9 skillId
					if (!this.isEmpty(transferParam.skillId)) {
						routePackage.getExt2()
								.setSkillId(transferParam.skillId);
					}
					// 10 skillName
					if (!this.isEmpty(transferParam.skillName)) {
						routePackage.getExt2().setSkillName(
								transferParam.skillName);
					}
					// 11 extraMsg
					if (!this.isEmpty(transferParam.extraMsg)) {
						routePackage.getExt2().setExtraMsg(
								transferParam.extraMsg);
					}
					// 12 nodeId
					if (!this.isEmpty(transferParam.nodeId)) {
						routePackage.getExt2().setNodeId(transferParam.nodeId);
					}
					// 13 calledNo
					if (!this.isEmpty(transferParam.calledNo)) {
						routePackage.getExt2().setCalledNo(
								transferParam.calledNo);
					}
					// 14 workNo
					if (!this.isEmpty(transferParam.workNo)) {
						routePackage.getExt2().setWorkNo(transferParam.workNo);
					}
					// 15 workCode
					if (!this.isEmpty(transferParam.workCode)) {
						routePackage.getExt2().setWorkCode(
								transferParam.workCode);
					}
					// 16 callTrace
					if (!this.isEmpty(transferParam.callTrace)) {
						routePackage.getExt2().setCallTrace(
								transferParam.callTrace);
					}
					// 17 custBrand
					if (!this.isEmpty(transferParam.custBrand)) {
						routePackage.getExt2().setCustBrand(
								transferParam.custBrand);
					}
					// 18 keyTrace
					if (!this.isEmpty(transferParam.keyTrace)) {
						routePackage.getExt2().setKeyTrace(
								transferParam.keyTrace);
					}
					// 19 callPort
					if (!this.isEmpty(transferParam.callPort)) {
						routePackage.getExt2().setCallPort(
								transferParam.callPort);
					}
					// 26 systemFlg
					if (!this.isEmpty(transferParam.systemFlg)) {
						routePackage.getExt2().setSystemFlg(
								transferParam.systemFlg);
					}
					// 27 contactId
					if (!this.isEmpty(transferParam.contactId)) {
						routePackage.getExt2().setContactId(
								transferParam.contactId);
					}
					// 28 opId
					if (!this.isEmpty(transferParam.opId)) {
						routePackage.getExt2().setOpId(
								transferParam.opId);
					}
					// 29 yjkf
					if (!this.isEmpty(transferParam.yjkf)) {
						routePackage.getExt2().setYjkf(
								transferParam.yjkf);
					}
					// 31 agentPhoneNo
					if (!this.isEmpty(transferParam.agentPhoneNo)) {
						routePackage.getExt2().setAgentPhoneNo(
								transferParam.agentPhoneNo);
					}
					// 32 sceneFlg
					if (!this.isEmpty(transferParam.sceneFlg)) {
						routePackage.getExt2().setSceneFlg(
								transferParam.sceneFlg);
					}
					// 34 nodeDetail
					if (!this.isEmpty(transferParam.nodeDetail)) {
						routePackage.getExt2().setNodeDetail(
								transferParam.nodeDetail);
					}
					// 35 satisfyData
					if (!this.isEmpty(transferParam.satisfyData)) {
						routePackage.getExt2().setSatisfyData(
								transferParam.satisfyData);
					}
					
					// 30 ext2Data
					if (transferParam.ext2Data) {
						// 1 contactId
						if(!this.isEmpty(transferParam.ext2Data.contactId)) {
							routePackage.getExt2().getExt2Data().setContactId(transferParam.ext2Data.contactId);
						}
						// 2 custFlg
						if(!this.isEmpty(transferParam.ext2Data.custFlg)) {
							routePackage.getExt2().getExt2Data().setCustFlg(transferParam.ext2Data.custFlg);
						}
						// 3 custName
						if(!this.isEmpty(transferParam.ext2Data.custName)) {
							routePackage.getExt2().getExt2Data().setCustName(transferParam.ext2Data.custName);
						}
						// 4 custAreaCode
						if(!this.isEmpty(transferParam.ext2Data.custAreaCode)) {
							routePackage.getExt2().getExt2Data().setCustAreaCode(transferParam.ext2Data.custAreaCode);
						}
						// 5 custBrand
						if(!this.isEmpty(transferParam.ext2Data.custBrand)) {
							routePackage.getExt2().getExt2Data().setCustBrand(transferParam.ext2Data.custBrand);
						}
						// 6 custStarLv
						if(!this.isEmpty(transferParam.ext2Data.custStarLv)) {
							routePackage.getExt2().getExt2Data().setCustStarLv(transferParam.ext2Data.custStarLv);
						}
						// 7 custMidHighFlg
						if(!this.isEmpty(transferParam.ext2Data.custMidHighFlg)) {
							routePackage.getExt2().getExt2Data().setCustMidHighFlg(transferParam.ext2Data.custMidHighFlg);
						}
						// 8 custStatus
						if(!this.isEmpty(transferParam.ext2Data.custStatus)) {
							routePackage.getExt2().getExt2Data().setCustStatus(transferParam.ext2Data.custStatus);
						}
						// 9 contentDesc
						if(!this.isEmpty(transferParam.ext2Data.contentDesc)) {
							routePackage.getExt2().getExt2Data().setContentDesc(transferParam.ext2Data.contentDesc);
						}
						// 10 acceptOpId
						if(!this.isEmpty(transferParam.ext2Data.acceptOpId)) {
							routePackage.getExt2().getExt2Data().setAcceptOpId(transferParam.ext2Data.acceptOpId);
						}
						// 11 provinceVdnInfo
						if(!this.isEmpty(transferParam.ext2Data.provinceVdnInfo)) {
							routePackage.getExt2().getExt2Data().setProvinceVdnInfo(transferParam.ext2Data.provinceVdnInfo);
						}
						// 12 uniqueElementInfo
						if(!this.isEmpty(transferParam.ext2Data.uniqueElementInfo)) {
							routePackage.getExt2().getExt2Data().setUniqueElementInfo(transferParam.ext2Data.uniqueElementInfo);
						}
					}
					
					return routePackage;
				},
				/**
				 * 在呼出的时候设置呼叫数据
				 */
				setDataCallOutTransToIVR : function(transType, transferParam) {

				},
				/**
				 * 转出至IVR
				 */
				transferOut : function(callId, transType, accessCode,
						transferCode) {
					var result = null;
					var isDefault=this._index.CTIInfo.isDefault;//缺省业务标志值
			        var proxyIp=this._index.CTIInfo.ProxyIP;//代理ip
			        var proxyPort =this._index.CTIInfo.ProxyPort;//代理端口
			        var ctiId=this._index.CTIInfo.CTIId; //ctiId
			        var ip=this._index.CTIInfo.IP;//直连ip
			        var port=this._index.CTIInfo.port;//直连端口
			        var sign_url="";
			        if(isDefault=="1"){//此种情况走nginx代理
			        	 sign_url=Constants.CCACSURL+proxyIp+":"+proxyPort+"/ccacs/"+ctiId+"/ws/call/transout";
			        }else{                                
			        	 sign_url= Constants.CCACSURL+ip+":"+port+"/ccacs/ws/call/transout"; //跨域直连
			        }
					// 转出的设备类型--坐席
					var calledDeviceType = Constants.CALLEDDEVICETYPE_IVR;// 3：IVR，以后从常量中获取
					// 转出时的模式 0：释放转 1：挂起转
					var transferMode = transType;
					// 转出的被叫号码
					var calledDigits;
					// 通过特定方法获取系统参数：流程接入码组成方式
					if (accessCodeStructure == Constants.SYS_TRANSFER_ONLY) {
						calledDigits = transferCode;
					} else {
						calledDigits = accessCode + transferCode;
					}

					var data = {
						"opserialNo" : this._index.serialNumber.getSerialNumber(),
						"callId" : callId,
						"calledDeviceType" : calledDeviceType,
						"transferMode" : transferMode,
						"calledDigits" : calledDigits,
						"callerDigits" : "",
						"origedDigits" : "",
						"attachedData" : ""
					}
					var that = this;
					if(this._index.queue.browserName==="IE"){
						$.ajax({
							type : "POST",
							async : false,
							url : sign_url,
							data : JSON.stringify(data),
							crossDomain : true,
//							xhrFields : {
//								withCredentials : true
//							},
							contentType : "application/json; charset=utf-8",
							success : function(json) {
								var resultMsg;
								if (json.result == '0') {
									resultMsg = "转IVR成功";
									console.log(resultMsg);
								} else {
//									resultMsg = that._index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result, "转出至IVR失败，错误码：" + json.result);
//									that._index.popAlert(resultMsg, "转出至IVR");
									var errorcodeResultMsg=that._index.ErrorcodeSearch.errorcodeSearch(json.result);
									that._index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
								}
								result = json.result;
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								var errorParams = {
										"XMLHttpRequest" : XMLHttpRequest,
										"textStatus" : textStatus,
										"errorThrown" : errorThrown
								};
							}
						});
					} else {
						$.ajax({
							type : "POST",
							async : false,
							url : sign_url,
							data : JSON.stringify(data),
							crossDomain : true,
							xhrFields : {
								withCredentials : true
							},
							contentType : "application/json; charset=utf-8",
							success : function(json) {
								var resultMsg;
								if (json.result == '0') {
									resultMsg = "转IVR成功";
									console.log(resultMsg);
								} else {
//									resultMsg = that._index.ctiInit.ErrorcodeSearch.ErrorcodeSearch(json.result, "转出至IVR失败，错误码：" + json.result);
//									that._index.popAlert(resultMsg, "转出至IVR");
									var errorcodeResultMsg=that._index.ErrorcodeSearch.errorcodeSearch(json.result);
									that._index.popAlert(errorcodeResultMsg.errorMsg, errorcodeResultMsg.errorcode);  
								}
								result = json.result;
							},
							error : function(XMLHttpRequest, textStatus,
									errorThrown) {
								var errorParams = {
										"XMLHttpRequest" : XMLHttpRequest,
										"textStatus" : textStatus,
										"errorThrown" : errorThrown
								};
							}
						});
					}
					return result;
				},
				/**
				 * base64加密
				 */
				base64Encode : function(data) {
					return base64.encode(data);
				},
				/**
				 * base64解密
				 */
				base64Decode : function(data) {
					return base64.decode(data);
				},
				/**
				 * callData对象转json
				 */
				callData2Json : function(callData) {
					return JSON.stringify(callData);
				},
				/**
				 * json转callData对象
				 */
				json2CallData : function(json) {
					return JSON.parse(json);
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
			return utils;
		});