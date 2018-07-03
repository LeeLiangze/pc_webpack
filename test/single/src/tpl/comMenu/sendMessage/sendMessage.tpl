<div class="send-message-box">
	<div class="messagebox">
		<div class="main-callnumber-box clearfloat">
			<span class="call-number-word float-left">
				&nbsp;&nbsp;&nbsp;&nbsp;主叫号码
			</span>
			<div class="number-choice float-left">
				<div class="show-number">请选择主叫号码</div>
				<img src="./send-message-down.png" class="send-message-down"/>
			</div>
		</div>
		<div class="more-number hidden">
			{{#each mainCallNumber}}<div class="number">{{this}}</div>{{/each}}
		</div>	
	</div>
	
	
	<div class="messagebox">
		<div class="main-callnumber-box clearfloat">
			<span class="call-number-word float-left">
				接收人号码
			</span>
			<div class="number-choice float-left">
				<input class="show-number accept-number" value="请选择接收人号码" type="text" target_type='input'>
				<img src="./send-message-down.png" class="send-message-down"/>
			</div>
		</div>
		<div class="more-number hidden">
			{{#each receiveNumber}}<div class="number">{{this}}</div>{{/each}}
		</div>	
	</div>	
	
	<div class="messagebox">
		<div class="main-callnumber-box clearfloat">
			<span class="call-number-word float-left">
				&nbsp;&nbsp;&nbsp;&nbsp;转接备注
			</span>
			<div class="number-choice float-left">
				<div class="show-number">请选择短信模板</div>
				<img src="./send-message-down.png" class="send-message-down"/>
			</div>
		</div>
		<div class="more-number hidden" target_id='message'>
			{{#each messageTemplate}}<div class="number">{{this}}</div>{{/each}}
		</div>
		<textarea class="message-content">请输入发送短信内容</textarea>
	</div>
	<div class="operation-box">
		<div class="send-enter">
			发&nbsp;送
		</div>
		<div class="send-cancel">
			取&nbsp;消
		</div>
	</div>
</div>
