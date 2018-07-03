<div class="jf-right-wrap-bak">

	<div class="proAndCityDiv">
		<ul class="proAndCity">
			<li class="labelLi">
				<label>省份地市</label>
			</li>
			<li id="provinceId_skillQue">
				<select name="provinceSelect" id="provinceSelect">
					<option value="">请选择</option>
				</select>
			</li>
			<li class="separatorLi">
				<label></label>
			</li>
			<li id="cityId_skillQue"></li>
		</ul>
	</div>
	
	<!-- 
	<div class="show_waitingNum" id="show_waitingNum">
		<table class="waitingTable">
			<tr>
				<th class="waitingTextTH">
					<p class="waitingText">等待数</p>
				</th>
			</tr>
			<tr class="waitingTR" id="waitingTR">
				<td class="waitingTD">
					<p class="waitingNum" id="waitingNum"></p>
				</td>
			</tr>
		</table>
	</div>
	-->
	
	<div class="list_skillQue" id="skillList_skillQue"></div>

	<div class="commentDiv">
		<ul>
			<li class="commentLi">
				<label for="notesId_skillQue">转接备注</label>
				<div>
					<textarea name="notes" id="notesId_skillQue" cols="100" rows="3"  maxlength="500" placeholder="请输入转接备注"></textarea>
				</div>
			</li>
			<li class="radioLi" id="transferId_skillQue">
				<label for="notesId_skillQue">转接方式</label>
				<input name="transfer" type="radio" value="0" class="radio_transfer">释放转</input> 
				<input name="transfer" type="radio" value="2" class="radio_transfer" checked="checked">成功转</input> 
			</li>
		</ul>
	</div>

	<hr/>
	
	<div class="buttonDiv">
		<ul>
			<li class="disabled liHide" id="InterHelpAudioSkill">
				<input mo="000208002008004" value="内部求助" disabled="true" type="button" class="t-btn t-btn-blue t-btn-sm" id="interHelpBtn_skillQueComm"></input>
			</li>
			<li class="enable liShow" id="TransferSkill">
				<input mo="000208002008005" value="转接"  type="button" class="t-btn t-btn-blue t-btn-sm" id="transferBtn_skillQueComm"></input>
			</li>
			<li class="enable liShow">
				<input value="退出"  type="button" class="t-btn t-btn-blue t-btn-sm" id="cancelBtn_skillQueComm"></input>
			</li>
		</ul>
	</div> 
	
</div>