<div class="jobNumMainDiv">
	<div class="t-columns-3 divCenterStyle">
		<ul class="t-columns-group">
			<li>
				<label>省份地市</label>
				<ul class="proAndCityUl">
					<li id="provinceId_transfer">
						<select name="provinceSelect" id="provinceSelect">
							<option value="">请选择</option>
						</select>
					</li>
					<li class="cityUitwo">
						<label>-</label>
					</li>
					<li id="cityId_transfer">
						<select class="select_transfer" name="selectStatus" id="city_select_transfer" >
							<option value="" >请选择</option> 
						</select>
					</li>
				</ul>
			</li>
			
			<li id="skillId_transfer">
						<label>技能</label>
						<select class="select_transfer" name="selectStatus" id="skill_select_transfer" >
							<option value="" >请选择</option> 
						</select>
			</li>
			
			<li>
				<label>状态</label>
				<div class="leftWidth">
					<select class="statusSelect" name="selectStatus" id="selectStatusId_transfer" multiple="multiple">  
						<option value="3" selected="selected">示忙</option>   
						<option value="4" selected="selected">空闲</option>   
						<option value="5" selected="selected">整理</option>   
						<option value="7" selected="selected">通话</option>   
						<option value="8" selected="selected">休息</option>
					</select> 
				</div>
			</li>
			
			<li>
				<label>账号</label>
				<div class="leftWidthAccount">
					<input type="text" name="account" id="accountId_transfer" class="input"/>
				</div>
			</li>
			
			<li id="orgId_transfer" class="orgId_transfer"></li>
			
			<li>
				<label>包含子部门</label>
				<ul class="departAndSearchUl">
					<li class="searchOne">
						<div>
							<select id="isCheckSubOrga_jobNumListBak">  
								<option value="0" selected="selected">否</option>   
								<option value="1" selected="selected">是</option>   
							</select> 
						</div>
					</li>
					<li class="searchTwo">
						<a class="t-btn t-btn-blue t-btn-sm" id="searchId_transfer">查询</a>
					</li>
				</ul>
			</li>
		</ul> 
	</div>
	
	<div class="list divCenterStyle" id="jobNumList_transfer"/>
	
	<div class="commentDivJob divCenterStyle">
		<ul>
			<li class="commentLi">
				<label for="notesId_skillQue">转接备注</label>
				<div>
					<textarea name="notes" id="notesId_transfer" cols="100" rows="3"  maxlength="500" placeholder="请输入转接备注"></textarea>
				</div>
			</li>
			<li class="radioLi" id="transferId_transfer">
				<label for="notesId_skillQue">转接方式</label>
				<input name="transfer" type="radio" value="0" class="radio_transfer">释放转</input> 
				<input name="transfer" type="radio" value="2" class="radio_transfer" checked="checked">成功转</input> 
			</li>
		</ul>
	</div>
	<hr/>
</div>
<div class="buttonDivs">
	<ul class="buttonUl">
		<li class="disabled liHide" id="InterHelpAudioComm">
			<input mo="000208002008008" value="内部求助" disabled="true" type="button" class="t-btn t-btn-blue t-btn-sm" id="interHelpBtn_transferComm" />
		</li>
		<li class="enable liHide" id="InterCallAudioComm">
			<input mo="000208002008009" value="内部呼叫" type="button" class="t-btn t-btn-blue t-btn-sm" id="interCommBtn_transferComm" />
		</li>
		<li class="enable liHide" id="AuditAudioComm">
			<input mo="000208002008010" value="旁听"   type="button" class="t-btn t-btn-blue t-btn-sm" id="auditBtn_transferComm" />
		</li>
		<li class="enable liHide" id="InsertAudioComm"> 
			<input mo="000208002008011" value="插入"  type="button" class="t-btn t-btn-blue t-btn-sm" id="insertBtn_transferComm" />
		</li>
		<li class="enable liShow" id="InterceptAudioComm">
			<input mo="000208002008012" value="拦截"  type="button" class="t-btn t-btn-blue t-btn-sm" id="interceptBtn_transferComm" />
		</li>
		<li class="enable liShow" id="ForceBusyAudioComm">
			<input mo="000208002008013" value="强制示忙" type="button" class="t-btn t-btn-blue t-btn-sm" id="forceBusyBtn_transferComm" />
		</li>
		<li class="enable liShow" id="ForceDisplayAudioComm">
			<input mo="000208002008014" value="强制示闲"  type="button" class="t-btn t-btn-blue t-btn-sm" id="forceDisplayBtn_transferComm" />
        </li>
		<li class="enable liShow" id="ForceBreakAudioComm">
			<input mo="000208002008015" value="强制休息"  type="button" class="t-btn t-btn-blue t-btn-sm" id="forceBreakBtn_transferComm" />
		</li>
		<li class="enable liShow" id="ForceCheckOutAudioComm">
			<input mo="000208002008016" value="强制签出"  type="button" class="t-btn t-btn-blue t-btn-sm" id="forceCheckOutBtn_transferComm" />
		</li>
		<li class="enable liShow" id="SendMsgAudioComm">
			<input mo="000208002008017" value="发送通知"  type="button" class="t-btn t-btn-blue t-btn-sm" id="sendMsgBtn_transferComm" />
		</li>
		<li class="enable liShow" id="TransferAudioComm">
			<input mo="000208002008018" value="转接"  type="button" class="t-btn t-btn-blue t-btn-sm" id="transferBtn_transferwys" />
		</li>
		<li class="enable liShow">
			<input value="退出" type="button" class="t-btn t-btn-blue t-btn-sm" id="cancelBtn_transferComm" />
		</li>
	</ul>
</div>
<div class="jobNumNotifyDiv">
</div>