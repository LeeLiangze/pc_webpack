<div id="mainDiv" class="jf-right-wrap"> 
    <!--<div> 
        <h2>转咨询语音test</h2>  
    </div> -->
    <div> 
      <div class="ra-left"> 
        <div id="searchInputDiv"><input id="searchInput" type="text" placeholder="搜索节点" />
				<img id="searchImg" class="iconfont icon-chaxun" src="../../../../assets/img/comMenu/search.png" />
			</div>
        <div id="ST_zTree"></div> 
	<div id="margin"></div>
        <div id="pinYinSearchs">
           <div id="searchKeyboardTitle" style="display: none;"><label>搜索小键盘</label></div>
	           <table id="searchKeyboardArea" style="display: none;" cellspacing="0" cellpadding="0">
	                <tr>
	                  <td><input class="pinyinButton1" id="0" type="button" value="0"></input></td>
	                  <td><input class="pinyinButton1" id="1" type="button" value="1"></input></td>
	                  <td><input class="pinyinButton1" id="2" type="button" value="2"></input></td>
	                  <td><input class="pinyinButton1" id="3" type="button" value="3"></input></td>
	                  <td><input class="pinyinButton1" id="4" type="button" value="4"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="5" type="button" value="5"></input></td>
	                  <td><input class="pinyinButton1" id="6" type="button" value="6"></input></td>
	                  <td><input class="pinyinButton1" id="7" type="button" value="7"></input></td>
	                  <td><input class="pinyinButton1" id="8" type="button" value="8"></input></td>
	                  <td><input class="pinyinButton1" id="9" type="button" value="9"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="A" type="button" value="A"></input></td>
	                  <td><input class="pinyinButton1" id="B" type="button" value="B"></input></td>
	                  <td><input class="pinyinButton1" id="C" type="button" value="C"></input></td>
	                  <td><input class="pinyinButton1" id="D" type="button" value="D"></input></td>
	                  <td><input class="pinyinButton1" id="E" type="button" value="E"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="F" type="button" value="F"></input></td>
	                  <td><input class="pinyinButton1" id="G" type="button" value="G"></input></td>
	                  <td><input class="pinyinButton1" id="H" type="button" value="H"></input></td>
	                  <td><input class="pinyinButton1" id="I" type="button" value="I"></input></td>
	                  <td><input class="pinyinButton1" id="J" type="button" value="J"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="K" type="button" value="K"></input></td>
	                  <td><input class="pinyinButton1" id="L" type="button" value="L"></input></td>
	                  <td><input class="pinyinButton1" id="M" type="button" value="M"></input></td>
	                  <td><input class="pinyinButton1" id="N" type="button" value="N"></input></td>
	                  <td><input class="pinyinButton1" id="O" type="button" value="O"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="P" type="button" value="P"></input></td>
	                  <td><input class="pinyinButton1" id="Q" type="button" value="Q"></input></td>
	                  <td><input class="pinyinButton1" id="R" type="button" value="R"></input></td>
	                  <td><input class="pinyinButton1" id="S" type="button" value="S"></input></td>
	                  <td><input class="pinyinButton1" id="T" type="button" value="T"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="U" type="button" value="U"></input></td>
	                  <td><input class="pinyinButton1" id="V" type="button" value="V"></input></td>
	                  <td><input class="pinyinButton1" id="W" type="button" value="W"></input></td>
	                  <td><input class="pinyinButton1" id="X" type="button" value="X"></input></td>
	                  <td><input class="pinyinButton1" id="Y" type="button" value="Y"></input></td>
	                </tr>
	                <tr>
	                  <td><input class="pinyinButton1" id="Z" type="button" value="Z"></input></td>
	                  <td><input class="pinyinButton2" id="backspace" type="button" value="删除"></input></td>
	                  <td><input class="pinyinButton2" id="clear" type="button" value="清空"></input></td>
	                  <td colspan="2"><input class="pinyinButton3" id="comfirm" type="button" value="确定"></input></td>
	                </tr>
	              </table>
	              <div id='pinyinBar'><label>展开小键盘</label></div>
        </div>

      </div> 
      <div class="ra-right"> 
          <!--下拉框-->
          <div class="t-columns-4">
            <ul class="t-columns-group">
		       <li id="cityCode"></li>
		       <li id="userClass"></li>
		       <li id="languageId"></li>
		       <li id="accessCode"></li>
            </ul>
          </div>

          <!--业务办理热点-->
        <div id="businessHot" class="hotMsg">
		          <label for="fm09">业务办理热点</label>
		          <div> 
		          	<ul class="hotspotUl" id="businessHotUl">
		            </ul>
		          </div> 
         </div>   
          <!--咨询语音热点-->
          <div id="voiceHot" class="hotMsg">
          <label for="fm09">咨询语音热点</label>
          <div> 
            <ul class="hotspotUl" id="voiceHotUl">
		     </ul>
          </div> 
          </div>
	<!--词组搜索-->
	<!--		<div class="hotMsg" id="searchPhrase">
				<label>词组搜索</label>
				<div id="phrase"></div>
		 </div> -->
          <!--呼叫转移-->
          <div class="labelDiv callBack hotMsg"> 
            <label for="fm09">呼叫转移</label> 
       
          <div class="textareaDiv"> 
          </div> 

          <!--radio & button-->
          <div class="t-columns-4"> 
            <ul class="t-columns-group"> 
               <li>
               	<input name="transfer" type="radio" value="0" checked="checked "/>释放转
               	<input name="transfer" type="radio" value="1"/>挂起转
                <a id="transferOut" class="btn btn-blue fr transfer bottomButton" >转移</a> 
                <a id="treeCancel" class="btn fr cancel bottomButton" >重置</a> 
              </li> 
            </ul> 
   			</div> 
          </div> 

         
          <div class="labelDiv message hotMsg"> 
            <label for="fm09">短信</label>           
			<div class="shortMsgTabs">	         
			</div>
			<div class="buttonDiv"> 
		            <a id="sendMesage" class="btn btn-blue fr transfer button">发送短信</a> 
		    </div>
       </div>  

    </div> 

</div> 
