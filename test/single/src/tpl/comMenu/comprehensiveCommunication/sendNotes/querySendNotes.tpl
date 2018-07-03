<div class="querySendNotesClass">
    <div class="searchContainer">
		<form>
			<div class="t-columns-3">
				<!-- 默认显示的检索字段 -->
				<ul class="t-columns-group">
					<li>
						<label for="startTime">
							开始时间
						</label>
						<div>
							<input id="startTime" name="startTime" type="text" onclick="laydate({istime: true, format: 'YYYY-MM-DD'})">
							<i class="iconfont icon-riqi" onclick="laydate({elem: '#startTime'});"/>
						</div>
					</li>
					<li>
						<label for="endTime">
							结束时间
						</label>
						<div>
							<input id="endTime" name="endTime" type="text" onclick="laydate({istime: true, format: 'YYYY-MM-DD'})">
							<i class="iconfont icon-riqi" onclick="laydate({elem: '#endTime'});" />
						</div>
					</li>
					<li>
						<label for="menuName">
							流水号
						</label>
						<div>
							<input class="input" id="sendId" name="sendId" type="text" />
						</div>
					</li>
					<li>
						<label for="menuName">
							发送人
						</label>
						<div>
							<input class="input" id="sender" name="sender" type="text" />
						</div>
					</li>
					<li>
						<label for="menuName">
							接收人
						</label>
						<div>
							<input class="input" id="receiver" name="receiver" type="text" />
						</div>
					</li>
					<li class="btnLi">
						<input class="t-btn t-btn-blue t-btn-sm" type="button" id="querySendNotes" mo="000108003003001" value="查询" />
						<input class="t-btn t-btn-blue t-btn-sm" type="button" id="notesRemove" value="重置" />
					</li>
				</ul>
			</div>
		</form>
    </div>
    <div class="jf-search-result listContainer " />
</div>