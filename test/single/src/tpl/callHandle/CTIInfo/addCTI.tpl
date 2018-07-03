<div class="jf-right-wrap has-ctrl-bar">

		<div class="jf-title">
			<h2>新增CTI</h2>
		</div>

		<div class="jf-form columns-4">

			<!-- 默认显示的检索字段 -->
			<ul class="jf-form-item">
			  <li>
					<label for="fm01" class="ctiLabel"> CTIID
				</label>
					<div>
						<input id  = "add_cti_id" type="text" value="省份全拼+业务标识" class="font1" 
						onblur="if(this.value==''){this.value='省份全拼+业务标识';this.className='font1'}" 
						onfocus="if(this.value==this.defaultValue){this.value='';this.className='font2'}">
					</div>
				</li>
				<li>
					<!-- 必填项为label追加样式: necessary --> <label for="fm02" class="ctiLabel"> 显示名称
				</label>
					<div>
						<input id="add_cti_name" type="text"> 
					</div>
				</li>
				<li><label for="fm03" class="ctiLabel"> IP地址</label>
					<div>
						<input id="add_cti_ip" type="text">
					</div></li>
				<li><label for="fm04" class="ctiLabel"> 端口</label>
					<div>
						<input id="add_cti_port" type="text">
					</div></li>
				<li><label for="fm05" class="ctiLabel"> 省份 </label>
					<div>
					<select id="add_cti_province"  class="selectProvice"><option
								selected="selected" value="" class="iconfont icon-riqi"></option></select>
					</div></li>
				<li><label for="fm06" class="ctiLabel"> CCID </label>
					<div>
						<input id="add_cti_ccid" type="text">
					</div></li>
				<li><label for="fm07" class="ctiLabel">内网IP地址 </label>
					<div>
						<input id="add_cti_backPlatIp" type="text">
					</div></li>
				<li><label for="fm08" class="ctiLabel"> 内网端口 </label>
					<div>
						<input id="add_cti_backPlatPort" type="text">
					</div></li>
				<li><label for="fm10" class="ctiLabel"> CCUCSIP </label>
					<div>
						<input id="add_cti_ccucsIP" type="text">
					</div></li>
				<li><label for="fm11" class="ctiLabel"> CCUCS端口 </label>
					<div>
						<input id="add_cti_ccucsPort" type="text">
					</div></li>
				<li><label for="fm09" class="ctiLabel"> 最后修改人 </label>
					<div>
						<input id="add_cti_staff" type="text" readonly="readonly" >
					</div></li>
				<!-- <li><label for="fm08"> 最后修改时间 </label>
					<div>
						<input id="add_cti_time" name="add_cti_time" onclick="laydate({istime:true,format:'YYYY-MM-DD hh:mm:ss'})" type="text">
						<i class="iconfont icon-riqi" onclick="laydate({elem:'#add_cti_time'});"></i>
					</div></li>-->
			</ul>
			
			<div class="jf-search-btns">
			<p  class="jf-search-btns-p">VDN列表</p>
			<a class="btn btn-blue fr" href="javascript:void(0);"
				id="add_add_vdn">新增</a>
			<input class="btn fr" type="button" id="add_vdn_save" value="保存" /> <!-- btn-blue-->
			<input class="btn fr" type="button" id="add_vdn_cancel" value="取消" />
		</div>
		
		<table id="add_vdn_title">
			<tr>
				<td>VDNID</td>
				<td>VDN名称</td>
				<td>SipServer</td>
				<td></td>
				<td>操作</td>								
			</tr>
		</table>
		</div>
	</div>