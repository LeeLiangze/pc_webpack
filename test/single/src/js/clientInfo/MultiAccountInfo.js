define(function(){
    var multiAccountInfo=function(){

		/*
			*accountId	    	string	账号id
			*channelId	    	string	渠道id
			*screenName	    	string	昵称
			*socialLevel	    string	联系人社区等级。
			*province	    	string	客户在社会化媒体上的注册 省份。
			*city	        	string	客户在社会化媒体上的注册 城市。
			*location	    	string	客户联系地址。
			*profileImageUrl	string	联系人头像地址。
			*gender	        	string	客户性别。
			*tags	        	string	联系人标签。
			*url	            string	联系人url。
			*verified	    	string	微博用户标示是否加v：false：不加v true：加v
			*followersCount		integer	粉丝数。
			*friendsCount		integer	关注数。
			*statusesCount		integer	微博数。
			*favouritesCount	integer	收藏数。
			*description	    string	描述信息。
			*regdate	        string	联系人注册时间。
			*domainUrl	    	string	联系人主页地址。
			*mediaTypeId        string  媒体类型
			*mediaTypeName		string	媒体类型名称
		*/

		/*
		 * 账号id
		 */
		this.accountId; 
		/*
		 * 渠道id
		 */
		this.channelId; 
		/*
		 * 昵称
		 */
		this.screenName; 
		/*
		 * 联系人社区等级
		 */
		this.socialLevel; 
		/*
		 * 客户在社会化媒体上的注册 省份
		 */
		this.province; 
		/*
		 * 客户在社会化媒体上的注册 城市
		 */
		this.city; 
		/*
		 * 客户联系地址
		 */
		this.location; 
		/*
		 * 联系人头像地址
		 */
		this.profileImageUrl; 
		/*
		 * 客户性别
		 */
		this.gender; 
		/*
		 * 联系人标签
		 */
		this.tags; 
		/*
		 * 联系人url
		 */
		this.url; 
		/*
		 * 微博用户标示是否加v：false：不加v true：加v
		 */
		this.verified; 
		/*
		 * 粉丝数
		 */
		this.followersCount; 
		/*
		 * 关注数
		 */
		this.friendsCount; 
		/*
		 * 微博数
		 */
		this.statusesCount; 
		/*
		 * 收藏数
		 */
		this.favouritesCount; 
		/*
		 * 描述信息
		 */
		this.description; 
		/*
		 * 联系人注册时间
		 */
		this.regdate; 
		/*
		 * 联系人主页地址
		 */
		this.domainUrl; 
		/*
		 * 媒体类型
		 */
		this.mediaTypeId; 
		/*
		 * 媒体类型名称
		 */
		this.mediaTypeName; 
    };
    //向外暴漏的方法，可被外部调用
    multiAccountInfo.prototype = {
    		/**
    		* 设置数值accountId
    		* @return string 返回数值
    		*/
    		setAccountId : function(accountId)
    		{
    			this.accountId = accountId; 
    		} ,
    		/**
    		* 获取数值accountId
    		* @return string 返回数值
    		*/
    	    getAccountId :function()
    		{
    			return this.accountId; 
    		},
    		
    		/**
    		* 设置数值channelId
    		* @return string 返回数值
    		*/
    		setChannelId: function(channelId)
    		{
    			this.channelId = channelId; 
    		} ,
    		/**
    		* 获取数值channelId
    		* @return string 返回数值
    		*/
    		getChannelId :function()
    		{
    			return this.channelId; 
    		},
    		
    		/**
    		* 设置数值screenName
    		* @return string 返回数值
    		*/
    		setScreenName : function(screenName)
    		{
    			this.screenName = screenName; 
    		} ,
    		/**
    		* 获取数值screenName
    		* @return string 返回数值
    		*/
    		getScreenName : function()
    		{
    			return this.screenName; 
    		} ,
    		
    		/**
    		* 设置数值socialLevel
    		* @return string 返回数值
    		*/
    		setSocialLevel :function(socialLevel)
    		{
    			this.socialLevel = socialLevel; 
    		} ,
    		/**
    		* 获取数值socialLevel
    		* @return string 返回数值
    		*/
    		getSocialLevel : function()
    		{
    			return this.socialLevel; 
    		},
    		
    		/**
    		* 设置数值province
    		* @return string 返回数值
    		*/
    		setProvince: function(province)
    		{
    			this.province = province; 
    		} ,
    		/**
    		* 获取数值province
    		* @return string 返回数值
    		*/
    		getProvince : function()
    		{
    			return this.province; 
    		} ,
    		
    		/**
    		* 设置数值city
    		* @return string 返回数值
    		*/
    		setCity: function(city)
    		{
    			this.city = city; 
    		} ,
    		/**
    		* 获取数值city
    		* @return string 返回数值
    		*/
    		getCity : function()
    		{
    			return this.city; 
    		},
    		
    		/**
    		* 设置数值location
    		* @return string 返回数值
    		*/
    		setLocation : function(location)
    		{
    			this.location = location; 
    		} ,
    		/**
    		* 获取数值location
    		* @return string 返回数值
    		*/
    		getLocation : function()
    		{
    			return this.location; 
    		} ,
    		
    		/**
    		* 设置数值profileImageUrl
    		* @return string 返回数值
    		*/
    		setProfileImageUrl : function(profileImageUrl)
    		{
    			this.profileImageUrl = profileImageUrl; 
    		} ,
    		/**
    		* 获取数值profileImageUrl
    		* @return string 返回数值
    		*/
    		getProfileImageUrl : function()
    		{
    			return this.profileImageUrl; 
    		}, 
    		
    		/**
    		* 设置数值gender
    		* @return string 返回数值
    		*/
    		setGender : function(gender)
    		{
    			this.gender = gender; 
    		} ,
    		/**
    		* 获取数值gender
    		* @return string 返回数值
    		*/
    		getGender : function()
    		{
    			return this.gender; 
    		} ,
    		
    		/**
    		* 设置数值tags
    		* @return string 返回数值
    		*/
    		setTags: function(tags)
    		{
    			this.tags = tags; 
    		}, 
    		/**
    		* 获取数值tags
    		* @return string 返回数值
    		*/
    		getTags : function()
    		{
    			return this.tags; 
    		}, 
    		
    		/**
    		* 设置数值url
    		* @return string 返回数值
    		*/
    		setUrl : function(url)
    		{
    			this.url = url; 
    		}, 
    		/**
    		* 获取数值url
    		* @return string 返回数值
    		*/
    		getUrl : function()
    		{
    			return this.url; 
    		} ,
    		
    		/**
    		* 设置数值verified
    		* @return string 返回数值
    		*/
    		setVerified : function(verified)
    		{
    			this.verified = verified; 
    		} ,
    		/**
    		* 获取数值verified
    		* @return string 返回数值
    		*/
    		getVerified : function()
    		{
    			return this.verified; 
    		},
    		
    		/**
    		* 设置数值followersCount
    		* @return string 返回数值
    		*/
    		setFollowersCount : function(followersCount)
    		{
    			this.followersCount = followersCount; 
    		}, 
    		/**
    		* 获取数值followersCount
    		* @return string 返回数值
    		*/
    		getFollowersCount : function()
    		{
    			return this.followersCount; 
    		},
    		
    		/**
    		* 设置数值friendsCount
    		* @return string 返回数值
    		*/
    		setFriendsCount : function(friendsCount)
    		{
    			this.friendsCount = friendsCount; 
    		} ,
    		/**
    		* 获取数值friendsCount
    		* @return string 返回数值
    		*/
    		getFriendsCount : function()
    		{
    			return this.friendsCount; 
    		},
    		
    		/**
    		* 设置数值statusesCount
    		* @return string 返回数值
    		*/
    		setStatusesCount : function(statusesCount)
    		{
    			this.statusesCount = statusesCount; 
    		} ,
    		/**
    		* 获取数值statusesCount
    		* @return string 返回数值
    		*/
    		getStatusesCount : function()
    		{
    			return this.statusesCount; 
    		} ,
    		
    		/**
    		* 设置数值favouritesCount
    		* @return string 返回数值
    		*/
    		setFavouritesCount : function(favouritesCount)
    		{
    			this.favouritesCount = favouritesCount; 
    		} ,
    		/**
    		* 获取数值favouritesCount
    		* @return string 返回数值
    		*/
    		getFavouritesCount : function()
    		{
    			return this.favouritesCount; 
    		}, 
    		
    		/**
    		* 设置数值description
    		* @return string 返回数值
    		*/
    		setDescription :function(description)
    		{
    			this.description = description; 
    		} ,
    		/**
    		* 获取数值description
    		* @return string 返回数值
    		*/
    		getDescription : function()
    		{
    			return this.description; 
    		} ,
    		
    		/**
    		* 设置数值regdate
    		* @return string 返回数值
    		*/
    		setRegdate : function(regdate)
    		{
    			this.regdate = regdate; 
    		} ,
    		/**
    		* 获取数值regdate
    		* @return string 返回数值
    		*/
    		getRegdate : function()
    		{
    			return this.regdate; 
    		} ,
    		
    		/**
    		* 设置数值domainUrl
    		* @return string 返回数值
    		*/
    		setDomainUrl : function(domainUrl)
    		{
    			this.domainUrl = domainUrl; 
    		} ,
    		/**
    		* 获取数值domainUrl
    		* @return string 返回数值
    		*/
    		getDomainUrl : function()
    		{
    			return this.domainUrl; 
    		} ,
    		/**
    		* 设置数值mediaTypeId
    		* @param string 传参
    		*/
    		setMediaTypeId : function(mediaTypeId)
    		{
    			this.mediaTypeId = mediaTypeId; 
    		} ,
    		/**
    		* 获取数值mediaTypeId
    		* @return string 返回数值
    		*/
    		getMediaTypeId : function()
    		{
    			return this.mediaTypeId; 
    		} ,
    		/**
    		* 设置数值mediaTypeName
    		* @param string 传参
    		*/
    		setMediaTypeName : function(mediaTypeName)
    		{
    			this.mediaTypeName = mediaTypeName; 
    		} ,
    		/**
    		* 获取数值mediaTypeName
    		* @return string 返回数值
    		*/
    		getMediaTypeName : function()
    		{
    			return this.mediaTypeName; 
    		}
    };


    return multiAccountInfo
});