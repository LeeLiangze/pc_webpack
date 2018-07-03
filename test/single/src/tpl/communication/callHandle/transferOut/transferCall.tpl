<div class="callout-box clearfloat">
	<div class="call-number-panel float-left clearfloat">
		<div class="call-number-num">1</div>
		<div class="call-number-num call-number-center">2</div>
		<div class="call-number-num">3</div>
		<div class="call-number-num call-number-bottom">4</div>
		<div class="call-number-num call-number-center call-number-bottom">5</div>
		<div class="call-number-num call-number-bottom">6</div>
		<div class="call-number-num">7</div>
		<div class="call-number-num call-number-center">8</div>
		<div class="call-number-num">9</div>
		<div class="call-number-num call-number-top">*</div>
		<div class="call-number-num call-number-center call-number-top">0</div>
		<div class="call-number-num call-number-top">#</div>
		<div class="call-number-block">
		</div>
		</div>
	<div class=call-out-number-choice>
	<div  id="showInputNum">
				<span class="call-out-name ">
				<div class="call-out-number" id="calledPerson">
				
		</div>		
		</span>
		<!--主叫号码-->
		<div id="showMainCallOutNum" class="call-out-number-box clearfloat call-out-number-box-common">
				<span style='font-size:16px'>主叫号码</span>
				&nbsp;&nbsp;&nbsp;&nbsp;
				<select id="mainCallOutNum">
				<option>请选择主叫号码</option>
				{{#each callOutMainNumber}}
				<option>{{this}}</option>
				{{/each}}
				</select>
		</div>
	
	
		<div class="transferMode">
		
		 <!-- 转出模式显示处  释放转在外呼情况下隐藏,所以在js中动态添加了-->
		 	
           <input type="radio"  name="transferMode" id="transferMode_2" checked="checked"  value="成功转" text="chenggong"/>成功转
           &nbsp; &nbsp; 
           <input type="radio"  name="transferMode" id="transferMode_3" value="通话转"/>通话转
           &nbsp; &nbsp; 
           <input type="radio"	name="transferMode"  id="transferMode_4" value="三方转"/>三方转
         
		</div>
		
		<div class="call-out-call" id="tranOut">
			转出
		</div>
		
		<div class="call-out-cancel" id="cancel">
			取消
		</div>
	</div>
</div>