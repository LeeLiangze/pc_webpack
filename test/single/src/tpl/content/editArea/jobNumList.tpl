<div class="jobNumList-wrap">
	 <div class="jobNumList-area">
          <ul class="transferSelect">
              <li id="provinceId_skillQues"></li>
              <!-- <li id="cityId_skillQue" class="cityId_skillQue"></li> -->
              <!--地市-->
              <li id="cityId_skillQues">
                  <div class="leftWidth">
                     <select class="select_transfer" name="selectStatus" id="city_select_transfer" >
                      <option value="" >请选择</option> 
                     </select>
                  </div>
              </li>
              <!--技能-->
              <li id="skillId_transfers" class="skillId_transfers">
                  <label >技能</label>
                  <div class="leftWidth">
                     <select class="select_transfer" name="selectStatus" id="skill_select_transfer" >
                       <option value="" >请选择</option> 
                     </select>
                 </div>
              </li>
              <!--状态-->
               <li class="status_transfer">
                <label >状态</label>
                <div style="width:150px;">
                  <select class="statusSelect" name="selectStatus" id="selectStatusId_transfer" multiple="multiple">
                     <option value="3" selected="selected">示忙</option>   
                     <option value="4" selected="selected">空闲</option>   
                     <option value="5" selected="selected">整理</option>   
                     <option value="7" selected="selected">通话</option>   
                     <option value="8" selected="selected">休息</option>   
                  </select> 
                </div>
              </li>
              <!--账号-->
               <li >
                  <label >账号</label>
                    <div class="leftWidth">
                      <input type="text" name="account" id="accountId_transfer" class="input"/>
                    </div>
               </li>
                <!--组织机构-->
                <li id="orgId_transfers" class="orgId_transfers" style="margin-left:30px;width:30%;height:36px;"></li>
                 <!--包含子部门-->
                <li id="department_transfer" class="department_transfer">
                    <label >包含子部门</label>
                    <div class="leftWidth">
                       <select class="select_department" name="selectDepartment" id="isCheckSubOrga_jobNumList" > 
							<option value="0" selected="selected">否</option>   
							<option value="1" selected="selected">是</option> 
                       </select>
                   </div>
                </li>
                <li>
                    <button class="btn btn-blue fr btnSearch" id="jobNumListBtn_search" style="width:80px;height:30px;margin-left:8px;">查询</button>
                </li>
          </ul>
    </div>
	<div class="list_jobNum"  id="list_jobNum"></div>
	<div class="jobNumList_ps">
      <ul class="jobNumList-tool clearfix">
        <li class="remark_jobNumList">
             <label for="notesId_jobNumList">转接备注</label>
             <div>
             	 <textarea name="notes" id="notesId_jobNumList" cols="100" rows="7"  maxlength="500" ></textarea>
             </div>
     	</li>
     	<li id="transferId_jobNum" class="transferId_jobNum"> 
            <label><input name="transfer" type="radio" value="0" checked style="margin-right:10px;"/>释放转 </label> 
            <label  style="margin-left:20px;"><input name="transfer" type="radio" value="2" style="margin-right:10px;"/>成功转 </label>
        </li>
     </ul>
    </div>
    <div class="jobNumList-button-wrap">
    	<div class="jobNumList_button">
         	<button class="btn btn-blue fr btnSearch" id="jobNumListBtn_skillQuewys">转接</button>
      		<button class="btn fr btnClear" id="cancelBtn_jobNumList">退出</button>
    	</div>
    </div>
</div>