<div class="transfer-wrap">
	<div class="transfer-area">
         <ul class="transferSelect">
            <li id="provinceId_skillQues"></li>
            <li id="cityId_skillQues"></li>
            <li></li>
            <li></li>
        </ul>
    </div>
	<div class="list_skillQueue"  id="skillList_skillQue"></div>
	<div class="transfer_ps">
      <ul class="tranfer-tool clearfix">
        <li class="remark_skillQueue">
             <label for="notesId_skillQues">转接备注</label>
             <div>
             	 <textarea name="notes" id="notesId_skillQues" cols="100" rows="7"  maxlength="500" ></textarea>
             </div>
     	</li>
     	<li id="transferId_skillQue"> 
            <label><input name="transfer" type="radio" value="0" style="margin-left:10px;">释放转 </label> 
            <label style="margin-left:20px;"><input name="transfer" type="radio" value="2" checked="" style="margin-left:10px;">成功转 </label>
        </li>
     </ul>
    </div>
    <div class="transfer-button-wrap">
    	<div class="transfer_button">
         	<button class="btn btn-blue fr btnSearch" id="transferBtn_skillQuewys">转接</button>
      		<button class="btn fr btnClear" id="cancelBtn_skillQue">退出</button>
    	</div>
    </div>
    
</div>