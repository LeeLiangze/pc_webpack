/**
 * Created by peishuxian
 * 技能队列缓存
 */
define(function(){
	/*
	 * skillInfo	存储所有技能队列信息的数组
	 */
	var _skillInfos ;
	/*
	 * signInSkills	存储签入的技能信息的数组
	 */
	var _signInSkills ;
	
    var skillsInfoInit=function(){
    	
    };

    //向外暴漏的方法，可被外部调用
    skillsInfoInit.prototype = {
    		/**
    		* 设置技能队列信息数组
    		* @param array skillInfo
    		*/
    		setSkillInfos : function(skillInfos){
    			_skillInfos = skillInfos; 
    		},
    		
    		/**
    		* 获取技能队列信息数组
    		*/
    		getSkillInfos : function(){
    			return _skillInfos; 
    		},
    		/**
    		* 设置签入的技能信息数组
    		* @param array skillInfo
    		*/
    		setSignInSkills : function(param){
    			var signInSkills = new Array();
    			for(i=0;i<param.length;i++){
    				var value = param[i].skillId;
    				for(y=0;y<_skillInfos.length;y++){
    					if(_skillInfos[y].skillId==value){
    						var skillInfo={
    								"skillId":_skillInfos[y].skillId,
    								"skillName":_skillInfos[y].skillName,
    								"channelId":_skillInfos[y].channelId
    						};
    						signInSkills.push(skillInfo);
    					}
    				}
    			}
    			_signInSkills = signInSkills; 
    		},
    		
    		/**
    		* 获取签入的技能信息数组
    		*/
    		getSignInSkills : function(){
    			return _signInSkills; 
    		},
    		
    		/**
    		* 获取技能队列信息数组的大小
    		*/
    		getSkillInfosSize : function(){
    			return _skillInfos.length;
    		},
    		
    		/**
    		* 清空技能队列信息数组
    		*/
    		removeAllSkillInfo : function(){
    			return _skillInfos = [];
    		},
    		/**
    		* 清空签入的技能队列信息数组
    		*/
    		removeSignInSkills : function(){
    			return _signInSkills = [];
    		}
    };


    return skillsInfoInit
});















