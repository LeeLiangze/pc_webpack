<div id="ConfigDataItem" class="ConfigDataItem">
    <div class="ConfigDataItem_zTree">
         <div class="addCon_genre  btn-blue btn" id="addCon_genre">新增类别</div>
         <div class="addCon_dataItem  btn-blue btn" id="addCon_dataItem">新增信息项</div>
         <div style="clear:both"></div>
         <div id="CDItem_zTree" class="CDItem_zTree"></div>
    </div>   
     <ul class="CDItem_ul">
        <li><span class="CDItem_left">数据项标识</span><input class="CDItem_dataItemFlag">
            <span class="CDItem_right">数据项名称</span><input class="CDItem_dataItemName">
        </li>
        <li><span class="CDItem_left">数据项类型</span>
            <select id="CDItem_type" class="t-form-normal CDItem_type">
                       <option value="0">请选择</option>
                      <option value="1">字符型</option>
                      <option value="2">浮点型</option>
                      <option value="3">整形(int)</option>
                      <option value="4">日期型</option>
             </select>
            <span class="CDItem_right">业务系统</span>
            <input id="CDItem_serviceType" class="CDItem_serviceType">
             
        </li>
        <li><span class="CDItem_left">远程数据集</span>
               <select id="CDItem_dataSourceId" class="t-form-normal CDItem_dataSourceId">
               
               </select>  
           <span class="CDItem_right">远程数据集字段</span><input class="CDItem_sourceField">
        </li>
       <div class="CDItem_submit btn btn-blue">保存</div>
       <div class="CDItem_reset btn btn-blue">重置</div>
       <div class="CDItem_delete btn btn-blue">删除</div>
      </ul>
</div>