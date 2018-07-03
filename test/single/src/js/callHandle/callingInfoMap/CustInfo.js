/**
 * @desc  用户资费信息
 */
define(['Util'],function(Util){
    var custInfo=function(){

    	/*userName         String          客户名称
    	userId           String          客户标示ID
    	userIdVal        String          客户标示值
    	phoneNumber      String          客户手机号码
    	cityNm           String          地市名称
    	distrtCode       String          区号
    	provNm           String          客户归属地
    	provCode           String          客户归属地
    	
    	userBrand        String          客户品牌ID
    	userBrandVal     String          客户品牌值
    	userLevel        String          客户级别ID
    	userLevelVal     String          客户级别值
    	userStatus       String          客户状态
    	userStatusVal    String          客户状态值
    	userBegin        String          入网时间
    	realNameInfo     String          实名制信息
    	
    	starLevel        String          星级客户标示
    	starScore        String          星级得分
    	starTime         String          星级有效时间
    	email            String          Email地址
    	zipCode          String          邮政编码
    	
    	userAdd          String          邮寄地址
    	userNum          String          开户时联系电话
    	flag4G           String          4G用户标示
    	volteFlag        String          VOLTE标示
    	accoutDay        String          出账日
    	
    	curPlanId        String          当前主套餐编码
    	curPlanName      String          当前主套餐名称
    	startTime        String          当前主套餐生效时间
    	endTime          String          当前主套餐结束时间
    	nextPlanId       String          下周期主套餐标识
    	
    	nextPlanName     String          下周期主套餐名称
    	curFeeTotal      String          账户总余额
    	curFee           String          当前可用余额
    	realFee          String          实时话费
    	oweFee           String          历史欠费*/
    	this.userName ="";
    	this.userId ="";
    	this.userIdVal ="";
    	this.phoneNumber ="";
    	this.cityNm ="";
    	this.distrtCode ="";
    	this.provNm ="";
    	this.provCode ="";
    	this.userBrand ="";
    	this.userBrandVal ="";
    	this.userLevel ="";
    	this.userLevelVal ="";
    	this.userStatus ="";
    	this.userStatusVal ="";
    	this.userBegin ="";
    	this.realNameInfo ="";
    	this.starLevel ="";
    	this.starScore ="";
    	this.starTime ="";
    	this.email ="";
    	this.zipCode ="";
    	this.userAdd ="";
    	this.userNum ="";
    	this.flag4G ="";
    	this.volteFlag ="";
    	this.accoutDay ="";
    	this.curPlanId ="";
    	this.curPlanName ="";
    	this.startTime ="";
    	this.endTime ="";
    	this.nextPlanId ="";
    	this.nextPlanName ="";
    	this.curFeeTotal ="";
    	this.curFee ="";  
    	this.realFee ="";
    	this.oweFee ="";
    };
    //向外暴漏的方法，可被外部调用
    custInfo.prototype = {
    		setUserName:function(userName)
    		{
    			this.userName = userName; 
    		},
    		getUserName:function()
    		{
    			return this.userName; 
    		},
    		setUserId:function(userId)
    		{
    			this.userId = userId; 
    		},
    		getUserId:function()
    		{
    			return this.userId; 
    		},
    		setUserIdVal:function(userIdVal)
    		{
    			this.userIdVal = userIdVal; 
    		},
    		getUserIdVal:function()
    		{
    			return this.userIdVal; 
    		},
    		setPhoneNumber:function(phoneNumber)
    		{
    			this.phoneNumber = phoneNumber; 
    		},
    		getPhoneNumber:function()
    		{
    			return this.phoneNumber; 
    		},
    		setCityNm:function(cityNm)
    		{
    			this.cityNm = cityNm; 
    		},
    		getCityNm:function()
    		{
    			return this.cityNm; 
    		},
    		setDistrtCode:function(distrtCode)
    		{
    			this.distrtCode = distrtCode; 
    		},
    		getDistrtCode:function()
    		{
    			return this.distrtCode; 
    		},
    		setProvNm:function(provNm)
    		{
    			this.provNm = provNm; 
    		},
    		getProvNm:function()
    		{
    			return this.provNm; 
    		},
    		setProvCode:function(provCode)
    		{
    			this.provCode = provCode; 
    		},
    		getProvCode:function()
    		{
    			return this.provCode; 
    		},
    		setUserBrand:function(userBrand)
    		{
    			this.userBrand = userBrand; 
    		},
    		getUserBrand:function()
    		{
    			return this.userBrand; 
    		},
    		setUserBrandVal:function(userBrandVal)
    		{
    			this.userBrandVal = userBrandVal; 
    		},
    		getUserBrandVal:function()
    		{
    			return this.userBrandVal; 
    		},
    		setUserLevel:function(userLevel)
    		{
    			this.userLevel = userLevel; 
    		},
    		getUserLevel:function()
    		{
    			return this.userLevel; 
    		},
    		setUserLevelVal:function(userLevelVal)
    		{
    			this.userLevelVal = userLevelVal; 
    		},
    		getUserLevelVal:function()
    		{
    			return this.userLevelVal; 
    		},
    		setUserStatus:function(userStatus)
    		{
    			this.userStatus = userStatus; 
    		},
    		getUserStatus:function()
    		{
    			return this.userStatus; 
    		},
    		setUserStatusVal:function(userStatusVal)
    		{
    			this.userStatusVal = userStatusVal; 
    		},
    		getUserStatusVal:function()
    		{
    			return this.userStatusVal; 
    		},
    		setUserBegin:function(userBegin)
    		{
    			this.userBegin = userBegin; 
    		},
    		getUserBegin:function()
    		{
    			return this.userBegin; 
    		},
    		setRealNameInfo:function(realNameInfo)
    		{
    			this.realNameInfo = realNameInfo; 
    		},
    		getRealNameInfo:function()
    		{
    			return this.realNameInfo; 
    		},
    		setStarLevel:function(starLevel)
    		{
    			this.starLevel = starLevel; 
    		},
    		getStarLevel:function()
    		{
    			return this.starLevel; 
    		},
    		setStarScore:function(starScore)
    		{
    			this.starScore = starScore; 
    		},
    		getStarScore:function()
    		{
    			return this.starScore; 
    		},
    		setStarTime:function(starTime)
    		{
    			this.starTime = starTime; 
    		},
    		getStarTime:function()
    		{
    			return this.starTime; 
    		},
    		setEmail:function(email)
    		{
    			this.email = email; 
    		} ,
    		getEmail:function()
    		{
    			return this.email; 
    		},
    		setZipCode:function(zipCode)
    		{
    			this.zipCode = zipCode; 
    		},
    		getZipCode:function()
    		{
    			return this.zipCode; 
    		},
    		setUserAdd:function(userAdd)
    		{
    			this.userAdd = userAdd; 
    		},
    		getUserAdd:function()
    		{
    			return this.userAdd; 
    		},
    		setUserNum:function(userNum)
    		{
    			this.userNum = userNum; 
    		},
    		getUserNum:function()
    		{
    			return this.userNum; 
    		},
    		setFlag4G:function(flag4G)
    		{
    			this.flag4G = flag4G; 
    		},
    		getFlag4G:function()
    		{
    			return this.flag4G; 
    		},
    		setVolteFlag:function(volteFlag)
    		{
    			this.volteFlag = volteFlag; 
    		},
    		getVolteFlag:function()
    		{
    			return this.volteFlag; 
    		},
    		setAccoutDay:function(accoutDay)
    		{
    			this.accoutDay = accoutDay; 
    		},
    		getAccoutDay:function()
    		{
    			return this.accoutDay; 
    		},
    		setCurPlanId:function(curPlanId)
    		{
    			this.curPlanId = curPlanId; 
    		},
    		getCurPlanId:function()
    		{
    			return this.curPlanId; 
    		},
    		setCurPlanName:function(curPlanName)
    		{
    			this.curPlanName = curPlanName; 
    		},
    		getCurPlanName:function()
    		{
    			return this.curPlanName; 
    		},
    		setStartTime:function(startTime)
    		{
    			this.startTime = startTime; 
    		},
    		getStartTime:function()
    		{
    			return this.startTime; 
    		},
    		setEndTime:function(endTime)
    		{
    			this.endTime = endTime; 
    		},
    		getEndTime:function()
    		{
    			return this.endTime; 
    		},
    		setNextPlanId:function(nextPlanId)
    		{
    			this.nextPlanId = nextPlanId; 
    		},
    		getNextPlanId:function()
    		{
    			return this.nextPlanId; 
    		},
    		setNextPlanName:function(nextPlanName)
    		{
    			this.nextPlanName = nextPlanName; 
    		},
    		getNextPlanName:function()
    		{
    			return this.nextPlanName; 
    		},
    		setCurFeeTotal:function(curFeeTotal)
    		{
    			this.curFeeTotal = curFeeTotal; 
    		},
    		getCurFeeTotal:function()
    		{
    			return this.curFeeTotal; 
    		},
    		setCurFee:function(curFee)
    		{
    			this.curFee = curFee; 
    		},
    		getCurFee:function()
    		{
    			return this.curFee; 
    		},
    		setRealFee:function(realFee)
    		{
    			this.realFee = realFee; 
    		},
    		getRealFee:function()
    		{
    			return this.realFee; 
    		},
    		setOweFee:function(oweFee)
    		{
    			this.oweFee = oweFee; 
    		},
    		getOweFee:function()
    		{
    			return this.oweFee; 
    		}
    };
    return custInfo;
});
