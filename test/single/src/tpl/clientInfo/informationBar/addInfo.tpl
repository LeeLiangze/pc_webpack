<div id="addInformation" class="addInformation">
     <ul class="Information_ul">
        <li>
            <span class="bar_left">配置项标识</span><input class="bar_itemId">
            <span class="bar_right">配置项名称</span><input class="bar_itemName">
        </li>
        <li>
            <span class="bar_left">排序号</span>
            <input class="bar_orderNum">
           <span class="bar_left">显示类型</span>
           <select id="bar_displayType" class="t-form-normal bar_displayType">
                      <option value="">请选择</option>
                      <option value="LABLE">文本框</option>
                      <option value="TEXT">编辑框</option>
                      <option value="SELECT">下拉列表</option>
                      <option value="CUSTOMIZE">定制</option>
            </select>  
        </li>
        <li>
           <span class="bar_right">可见性</span>
           <select id="bar_visibility" class="t-form-normal bar_visibility">
                      <option value="">请选择</option>
                      <option value="1">可见</option>
                      <option value="0">不可见</option>
                      <option value="2">悬浮层可见</option>
            </select>
            <span class="bar_right">获取方式</span>
             <select id="bar_obtainDataMode" class="t-form-normal bar_obtainDataMode">
                      <option value="">请选择</option>
                      <option value="01">从呼叫信息中获取</option>
                      <option value="02">从互联网身份中获取</option>
                      <option value="03">从客户标签中获取</option>
                      <option value="04">从客户信息中获取</option>
                      <option value="05">从菜单中获取</option>
            </select>
        </li>
         <li>
           <span class="bar_right">获取脚本</span> 
             <select id="bar_obtainDataScript" class="t-form-normal bar_obtainDataScript">
                      
             </select>
            <span class="bar_right">关联数据字典</span>
             <select id="bar_isDatadict" class="t-form-normal bar_isDatadict">
                     <option value="">请选择</option>
                      <option value="0">是</option>
                      <option value="1">否</option>
            </select>
        </li>
        <li>
           <span class="bar_right">字典脚本</span> <input class="bar_dataDictscript">
            <span class="bar_right">关联链接</span>
             <select id="bar_isLink" class="t-form-normal bar_isLink">
                      <option value="">请选择</option>
                      <option value="N">无链接</option>
                      <option value="Y">有链接</option>
            </select>
        </li>
        <li>
           <span class="bar_right">链接方式</span> 
           <select id="bar_linkType" class="t-form-normal bar_linkType">
                     <option value="">请选择</option>
                      <option value="1">文本链接</option>
                      <option value="2">图片链接</option>
            </select>
            <span class="bar_right">图片URL</span>
            <input class="bar_picURL"> 
        </li>
        <li>
            <span class="bar_right">链接URL</span> 
            <input class="bar_linkURL"> 
            <span class="bar_right">链接参数名</span>
            <input class="bar_linkParaName"> 
        </li>
        <li>
            <span class="bar_right">参数值标志</span> 
            <input class="bar_isPrehandle"> 
            <span class="bar_right">自定义显示脚本</span>
            <input class="bar_displayScript"> 
        </li>
         <li>
            <span class="bar_right">回写字段</span> 
            <input class="bar_callbackField">
            <span class="bar_right">分组类型</span>
            <select id="bar_groupType" class="t-form-normal bar_groupType">
                     <option value="">请选择</option>
                      <option value="00">在客户信息栏中显示</option>
                      <option value="01">在更多客户信息中显示</option>
                      <option value="02">在互联网扩展信息中显示</option>
            </select>  
        </li>
       <div class="bar_submit btn btn-blue">确定</div>
       <div class="bar_reset btn btn-blue">重置</div>
    <ul>
</div>