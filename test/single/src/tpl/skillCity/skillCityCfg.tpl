<div class="sn-skillCityCfg if-skillCity-main">
	<div class="jf-right-wrap has-ctrl-bar pic-ctrl-bar" style="bottom: 0px;">
	<form id="skillCityForm">
		<div class="jf-form t-columns-4">
			<ul class="jf-form-item t-columns-group">
	        	<li id="ctiIdDivCfg" class="sn-select" style="position:relative">
	        	</li>
	        	<li id="vdnIdDivCfg" class="sn-select" style="position:relative">
	        	</li>
	        	<li id="proviceIdDivCfg" class="sn-select" style="position:relative">
	        	</li>
	        	<li id="cityIdDivCfg" class="sn-select" style="position:relative">
	        	</li>
			</ul>
            
			<div class="jf-search-btns">
	                <!--<a class="btn btn-blue fr skillCitySaveCfg">保存</a>-->
	                <a class="btn btn-blue fr skillCityClearCfg">重置</a>
			</div>	
	</form>
		
	</div>
	
	<div class="seperateLine"></div>
	<div id="skillCityConf">
		<div class="container" id="fASkillCity">
			<table>
				<tbody>
					<tr>
						<td><span><label id="null_">未关联地市的技能队列 </label></span></td>
						<td></td>
						<td><span><label id="null_">已关联地市的技能队列 </label></span></td>
					</tr>
					<tr>
						<td>
							<div id="noSelectListDiv">
								<div id="FAnoPut">
									<select id="FAnoSelect" size="10" multiple="multiple">
									</select>
								</div>
							</div>
						</td>
						<td>
							<table>
								<tbody>
									<tr>
										<td><input name="selectOne" class="selectOne"
											type="button" value="> " /></td>
									</tr>
									<tr>
										<td><input name="selectAll" class="selectAll"
											type="button" value=">>" /></td>
									</tr>
									<tr>
										<td><input name="returnOne" class="returnOne"
											type="button" value="< " /></td>
									</tr>
									<tr>
										<td><input name="returnAll" class="returnAll"
											type="button" value="<<" /></td>
									</tr>
								</tbody>
							</table>
						</td>
						<td>
							<div id="hasSelectListDiv">
								<div id="FAhas">
									<select id="FAhasSelect" size="10" multiple="multiple">
									</select>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="jf-search-btns">
                <a class="btn btn-blue fr skillCitySaveCfg">保存</a>
                <!--<a class="btn fr skillCityClearCfg">重置</a>-->
		</div>
	</div>
</div>