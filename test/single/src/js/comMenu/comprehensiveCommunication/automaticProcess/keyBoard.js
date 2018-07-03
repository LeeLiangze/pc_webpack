/**
 * 自动流程中 鼠标键盘输入框 输入框搜索方法
 */
define(['Util',
        'Compts'
        ],function(Util,Compts){
	 this.keyBoard=function(){};
	//鼠标键盘输入框
	keyBoard.prototype = {
			keyBoardSearch : function(tabInit,_index,hotSpotName,_option,uid1,uid2,$el,setting){
				var options = _option;
		 	   	var inputLength;
		 	   	var inputValue;
		 	   	var that = this;
		 	   	$("#searchInput",$el).keydown(function(e){//keyup
		 	   		var event = (typeof event!= 'undefined') ? window.event : e;
		 	   		if(event.keyCode == 13 && document.activeElement.id == "searchInput"){
		 	   		//if(event.keyCode == 13){
		 	   			that.searchResult(tabInit,_index,uid1,uid2,$el,setting);
		 	   			//event.stopPropagation();
		 	   			window.event.returnValue = false;
		 	   		}
		 	   	});

		 	   	$("#comfirm",$el).click(function(){
		 	   		that.searchResult(tabInit,_index,uid1,uid2,$el,setting);
		 	   	});

		 	   	$("#searchImg",$el).click(function(){
		 	   		that.searchResult(tabInit,_index,uid1,uid2,$el,setting);
		 	   	});
		 	   	
		 	   	$(".pinyinButton1",$el).click(function(){
		 	   		var value = $(this).val();
		 	   		inputValue = $("#searchInput",$el).val();
		 	   		inputValue = inputValue + value;
		 	   		$("#searchInput",$el).val(inputValue);		   
		 	   	});
		 	   	$("#backspace",$el).click(function(){
		 	   		inputLength = $("#searchInput",$el).val().length;
		 	   		inputValue = $("#searchInput",$el).val();
		 	   		if(inputLength > 0){
		 	   			inputValue = inputValue.substr(0,inputLength-1);
		 	   			$("#searchInput",$el).val(inputValue);
		 	   		}else{
		 	   			_index.popAlert("输入框已清空");
		 	   		}
		 	   	});
		 	   	$("#clear",$el).click(function(){
		 	   		inputLength = $("#searchInput",$el).val().length;
		 	   		inputValue = $("#searchInput",$el).val();
		 	   		if(inputLength > 0){
		 	   			$("#searchInput",$el).val("");
		 	   		}else{
		 	   			_index.popAlert("输入框已清空");
		 	   		}
		 	   	});

		 	   	$("#pinYinSearchs",$el).click(function(e){
		 	   		$("#ST_zTree").css("height","56.29%");
		 	   		$("#searchKeyboardArea",$el).show();
		 	   		$("#searchKeyboardTitle",$el).show();
		 	   		$("#pinyinBar",$el).hide();
		 	   		$("#searchKeyboardTitle",$el).show();
		 	   		$("#pinYinSearchs",$el).attr("id","pinYinSearch");
		 	   		e.stopPropagation();
		 	   	});

		 	   	$el.click(function(){
		 	   		$("#pinYinSearch",$el).attr("id","pinYinSearchs");
		 	   		$("#searchKeyboardArea",$el).hide();
		 	   		$("#searchKeyboardTitle",$el).hide();
						  if($("#pinyinBar",$el).length > 0){//判断元素是否存在
						  	$("#pinyinBar",$el).show();
						  }	
						  $("#ST_zTree").css("height","87.29%");
				});

//		 	   	$("#treeCancel",$el).click(function(){
//			 			   //清空树节点
//			 			   _leftTree.checkAllNodes(false);
//			 			//清空输入框
//			 			$("#searchInput",$el).val("");
//			 			 //清空热点区
//			 			 $("[name="+hotSpotName+"]:checkbox").each(function(){///////////////serviceHotSpot
//			 			 	$(this).attr("checked",false);
//			 			 });
//			 			//清空路径区
//			 			$(".textareaDiv",$el).empty();
//			 			//清空短信区
//			 			$('.shortMsgTabs',$el).empty();
//			 			selectedAllData = new Array();
//			 			tabInit.call(this);
//			 		});
		 	   },
		 	   //输入框搜索方法
			searchResult : function(tabInit,_index,uid1,uid2,$el,setting){
					var inputValue = $("#searchInput",$el).val();
					var cityCode = $("#cityCode select",$el).val();
					var userClass = $("#userClass select",$el).val();
					var languageId = $("#languageId select",$el).val();
					var accessCode = $("#accessCode select",$el).val();
					var params1 = {
						"alphabetCode" : inputValue,
						"cityCode" : cityCode,
						"userClass" : userClass,
						"languageId" : languageId,
						"accessCode" : accessCode,
						"bizTypeId" : "0771"
					}
					Util.ajax.postJson("front/sh/callHandle!execute?uid="+uid1+"&_="+Math.random(),params1,function(json,status){//servicePinyinSearch
						if(status) {
						//清空勾选项  start								
							//清空输入框
							 $("#searchInput",$el).val("");
							 //清空热点区
							$("[name=hotSpot]:checkbox").each(function(){
								$(this).attr("checked",false).attr("disabled",false);
								});
							$(".checkedLogo",$el).css('display','none');
							//清空路径区
							$(".textareaDiv",$el).empty();
							//清空短信区
							$('.shortMsgTabs',$el).empty();
							selectedAllData = new Array();
							tabInit.call(this);
						//清空勾选项  end
						//首字母未匹配，再匹配名称 start
						if(json.beans.length==0){
							var params2 = {
								"name" : inputValue,
								"cityCode" : cityCode,
								"userClass" : userClass,
								"languageId" : languageId,
								"accessCode" : accessCode
							}
							Util.ajax.postJson("front/sh/callHandle!execute?uid="+uid2+"&_="+Math.random(),params2,function(json,status){
								if(status) {
									if(json.beans.length==0){
										_index.popAlert("未搜到匹配结果，请重新搜索！");
									}else{
										_leftTree=new Compts.zTree.tierTree($el.find("#ST_zTree"), json.beans,setting);
									}
								} else {
									console.log("流程树获取失败");
								}
							});
						}//首字母未匹配，再匹配名称 end
						else{
							_leftTree=new Compts.zTree.tierTree($el.find("#ST_zTree"), json.beans,setting);
						}
					} else {
						_index.popAlert("未搜到匹配结果，请重新搜索！");
						console.log("流程树获取失败");
					}
				});
			}			
	};

	
	return keyBoard;
})
