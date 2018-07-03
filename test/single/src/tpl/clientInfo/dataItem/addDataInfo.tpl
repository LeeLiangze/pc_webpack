<div id="addDataInfo" class="addDataInfo">
     <ul class="addInfo_ul">
        <li><span class="addInfo_left">数据项标识</span><input class="addInfo_dataItemFlag">
            <span class="addInfo_right">数据项名称</span><input class="addInfo_dataItemName">
        </li>
        <li><span class="addInfo_left">数据项类型</span>
            <select id="addInfo_type" class="t-form-normal addInfo_type">
                      <option value="0">请选择</option>
                      <option value="1">字符型</option>
                      <option value="2">浮点型</option>
                      <option value="3">整形(int)</option>
                      <option value="4">日期型</option>
             </select>
            <span class="addInfo_right">业务系统</span>
            <input id="addInfo_serviceType" class="addInfo_serviceType">
        </li>
        <li><span class="addInfo_left">远程数据集</span>
               <select id="addInfo_dataSourceId" class="t-form-normal addInfo_dataSourceId">
                      
               </select>
           <span class="addInfo_right">远程数据集字段</span><input class="addInfo_sourceField">
        </li>
    <div class="addInfo_submit btn btn-blue">确定</div>
    <div class="addInfo_reset btn btn-blue">重置</div>
    <ul>
</div>