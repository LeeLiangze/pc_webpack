<div class="jf-right-wrap has-ctrl-bar">

		<div class="jf-title">
			<h2>CTI详细信息</h2>
		</div>

		<div class="jf-form columns-4">

			<!-- 默认显示的检索字段 -->
			<ul class="jf-form-item">
			   <li>
				<label for="fm01" class="ctiLabel"> CTIID </label>
					<div>
						<input id="up_cti_id" type="text" readonly="readonly">
					</div>
				</li>
				<li>
					<!-- 必填项为label追加样式: necessary --> <label for="fm02" class="ctiLabel"> 显示名称 </label>
					<div>
						<input id="up_cti_name" type="text">
					</div>
				</li>
				<li><label for="fm03" class="ctiLabel"> IP地址</label>
					<div>
						<input id="up_cti_ip" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm04" class="ctiLabel"> 端口</label>
					<div>
						<input id="up_cti_port" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm05" class="ctiLabel"> 省份 </label>
					<div>
						<select id="up_cti_province" class="selectProvice" disabled="disabled"><option selected="selected"
								value="" class="iconfont icon-riqi"></option></select>
					</div></li>

				<li><label for="fm06" class="ctiLabel"> CCID </label>
					<div>
						<input id="up_cti_ccid" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm07" class="ctiLabel">内网IP地址 </label>
					<div>
						<input id="add_cti_backPlatIp" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm08" class="ctiLabel"> 内网端口 </label>
					<div>
						<input id="add_cti_backPlatPort" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm10" class="ctiLabel"> CCUCSIP </label>
					<div>
						<input id="up_cti_ccucsIP" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm11" class="ctiLabel"> CCUCS端口 </label>
					<div>
						<input id="up_cti_ccucsPort" type="text" readonly="readonly">
					</div></li>
				<li><label for="fm09" class="ctiLabel"> 最后修改人 </label>
					<div>
						<input id="up_cti_staff" type="text" readonly="readonly">
					</div></li>
				<!-- <li><label for="fm08"> 最后修改时间 </label>
					<div>
						<input id="up_cti_time" type="text" name="up_cti_time" onclick="laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})" >
						<i class="iconfont icon-riqi" onclick="laydate({elem:'#up_cti_time'});"></i>
					</div></li> -->
			</ul>

			<div class="jf-search-btns">
				<p class="jf-search-btns-p">VDN列表</p>
<!-- 				<a class="btn btn-blue fr" href="javascript:void(0);"
					id="up_add_vdn">新增</a>
				<input class="btn fr" type="button" id="up_vdn_save" value="保存" /> --> <!--btn-blue-->
				<!-- <input class="btn fr" type="button" id="up_vdn_cancel" value="取消" /> -->
			</div>

			<table id="up_vdn_title">
				<tr>
					<td>VDNID</td>
					<td>VDN名称</td>
					<td>SipServer</td>
					<td>同步工号</td>	
					<td>同步技能</td>											
				</tr>
			</table>
		</div>
	</div>