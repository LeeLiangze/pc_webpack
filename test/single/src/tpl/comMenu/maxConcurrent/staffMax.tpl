<div id="jf-right-wrapIn" class="jf-right-wrap">
	<div class="searchContainer">
		<form>
			<div class="jf-form columns-3">
				<ul class="jf-form-item">
					<li id="mediaTypeId">
					</li>
					<li>
						<span>部门</span>
						<span id="department"></span>
					</li>
					<li>
						<span>是否包含子部门</span>
						<input id="relevance" name="relevance" type="checkbox"/>
					</li>
					<li id="jf-lis">
						<span>员工账号</span>
						<span>
							<input id="staffId" name="staffId" type="text"/>
						</span>
					</li>
					<li>
						<span></span>
						<div>
							<input type="text" style="display:none"/>
						</div>
					</li>
				</ul>
			</div>
			<div id="jf-search-btns" class="jf-search-btns">
				<div id="jf-search-left">
					<a id="insertStaffMax" class="btn btn-blue fl btnAdd">新增</a>
					<a id="delStaffMax" class="btn btn-blue fl btnDel">删除</a>
					<span id="totalNum"></span>
					<span id="textWarn"></span>
				</div>
				<div id="jf-search-right">
					<a id="selectStaffMax" class="btn btn-blue fr btnSearch">查询</a>
				</div>
			</div>
		</form>
	</div>
	<div>
	</div>
	<div class="jf-search-result listContainer"></div>
</div>