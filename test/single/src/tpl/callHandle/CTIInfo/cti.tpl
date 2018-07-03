<div class="jf-right-wrap">
	<div class="searchContainer">
		<form>
			<div class="jf-form columns-4">
				<ul class="jf-form-item">
				    <li>
                    	    <label for="sel_name">CTIID</label>
                        	<input id="sel_ctiid" class="inputSel" name="sel_ctiid" type="text">
                	</li>
					<li>
                    	    <label for="sel_name">显示名称</label>
                        	<input id="sel_name" class="inputSel" name="sel_name" type="text">
                	</li>
                	<li>
                    	    <label for="sel_ip">IP地址</label>                    	
                        	<input id="sel_ip" class="inputSel" name="sel_ip" type="text">                   
                	</li>
                	<li>
                    	    <label for="sel_state">状态</label>                   	
                        	<select id="sel_state" class="inputSel" style="height:28px;width:210px;">
								<option selected="selected" value="">全部</option>
								<option value="0">启用</option>
								<option value="1">废弃</option>
							</select>              
                	</li>
                	<li>
                    	    <label for="sel_province" style="margin-left:7px;">省份</label>
                        	<select id="sel_province" class="inputSel" style="height:28px;width:210px;">
                        		<option selected="selected" value="">全部</option>
                        	</select>
                	</li>
				</ul>
				<div class="jf-search-btns">
					<a class="btn btn-blue fl" id="cti_Add">新增</a>
                	<a class="btn btn-blue fl" id ="cti_Update">修改</a>
                	<a class="btn btn-blue fl" id="cti_Enable">启用</a>
                	<a class="btn btn-blue fl" id ="cti_Disable">废弃</a>
                	<!--CTI详情-->
                	<a class="btn btn-blue fl" id ="cti_Detail">详细信息</a>
					<a class="btn btn-blue fr " id="cti_Search">查询</a>
                	<a class="btn fr " id ="cti_Reset" style="margin-right: 10px;">重置</a>
				</div>
			</div>
		</form>
	</div>
		<div class="jf-search-result listContainer">
	</div>
</div>