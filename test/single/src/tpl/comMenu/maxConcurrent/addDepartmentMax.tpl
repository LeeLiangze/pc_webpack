<div id = "addDepart">
<table style="width:100%">
	<thead></thead>
	<tbody>
		<tr>
			<td>
				<div class="jf-form columns-1">
					<ul id="jf-add" class="jf-form-item">
						<li>
            				<span style="width:120px;margin-right:10px;">部门名称</span>
            					<span id="department"></span>
        				</li>
        				<li>
            				<span style="width:120px;margin-right:10px;">媒体类型</span>
            				<span>
		        				<input id="mediaTypeName" type="text" value="请选择媒体类型" readonly="readonly" onblur="if(this.value==''){this.value='请选择右侧媒体类型'}"/>
            				</span>
        				</li>
        				<li>
            				<span style="width:120px;margin-right:10px;">最大会话数</span>
            				<span>
		        				<input id="maxConcurrent" type="text" value="请输入最大会话数" onfocus="this.value=''" onblur="if(this.value==''){this.value='请输入最大会话数'}"/>
            				</span>
        				</li>
					</ul>
				</div>
			</td>
			<td style="width:180px;">
            <div style="overflow:scroll">
            	<table class="jf-table"><tbody id="mediaTypeId"></tbody></table>
            </div>
			</td>
		</tr>
	</tbody>
	<tfoot></tfoot>
</table>
</div>
<div>
	<div><p id="prompt"></p></div>
	<div style="width:230px;margin:auto;" class="jf-bottom-btns">
		<a id="saveMax" class="btn btn-blue">保存</a>
		<a id="resetMax" class="btn">返回</a>
	</div>
<div>