<div class="call-out-box clearfloat">
	<div class="call-number-panel float-left clearfloat">
		<div class="call-number-num"><a href="javascript:;">1</a></div>
		<div class="call-number-num call-number-center"><a href="javascript:;">2</a></div>
		<div class="call-number-num"><a href="javascript:;">3</a></div>
		<div class="call-number-num call-number-bottom"><a href="javascript:;">4</a></div>
		<div class="call-number-num call-number-center call-number-bottom"><a href="javascript:;">5</a></div>
		<div class="call-number-num call-number-bottom"><a href="javascript:;">6</a></div>
		<div class="call-number-num"><a href="javascript:;">7</a></div>
		<div class="call-number-num call-number-center"><a href="javascript:;">8</a></div>
		<div class="call-number-num"><a href="javascript:;">9</a></div>
		<div class="call-number-num call-number-top"><a href="javascript:;">*</a></div>
		<div class="call-number-num call-number-center call-number-top"><a href="javascript:;">0</a></div>
		<div class="call-number-num call-number-top"><a href="javascript:;">#</a></div>
		<div class="call-number-block">
		</div>
	</div>
	<div class="call-out-number-choice float-left call-out-number-choice-common">
		<div class="call-out-number-box clearfloat call-out-number-box-common">
			<span class="call-out-name float-left">
				主叫号码
			</span>
			<div class="call-out-choice float-left call-out-choice-common">
				<div class="call-out-show-number call-out-show-number-common">
					请选择主叫号码
				</div>
				<img src="../../../tpl/comMenu/callOut/call-out-down.png" class="call-out-down"/>
			</div>
			<div class="call-out-more-number call-out-more-number-common hid" >
				{{#each callOutMainNumber}}<div class="call-out-number">
					{{this}}
				</div>{{/each}}		
			</div>			
		</div>
		

		<div class="call-out-number-box clearfloat call-out-number-box-panpel">
			<span class="call-out-name float-left">
				被叫号码
			</span>
			<div class="call-out-choice float-left call-out-choice-panpel">
				<input type="text" class="call-out-show-number call-out-show-number-panpel" id="calledNumInput" value="请选择被叫号码">
				<img src="../../../tpl/comMenu/callOut/call-out-down.png" class="call-out-down"/>
			</div>
			<div class="call-out-more-number hid call-out-more-number-panpel">
				{{#each sendNumber}}<div class="call-out-number" target-id=1>
					{{this}}
				</div>{{/each}}			
			</div>
		</div>
		
		<div class="call-out-call">
			呼叫
		</div>
		
		<div class="call-out-cancel">
			取消
		</div>
	</div>
</div>