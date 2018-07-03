<div class="businessTree">
	<div id="tabControl" class="tabControl">
		<div class="headContent">
		    <ul class="treeUl" id="treeUl">
		    <script id="head_template" type="text/x-handlebars-template">
			    {{#each treeData}}
				   <li class="treeLi">
		         	<a href="javascript:void(0);" class="" proviceId="{{value}}" title="{{name}}"><span>{{val}}</span></a>
		  	   	   </li>
		        {{/each}}
		      </script>
		 	 </ul>
		    <a href="javascript:void(0); " class="swithLeft" id="swithLeft">&lt;</a>
		    <a href="javascript:void(0);" class="swithRight" id="swithRight">&gt;</a>
	    </div>
	<div id="operateBox">
		<input type="text" name="searchData" class="searchData" id="searchData" value="请输入搜索内容"/>
	</div>    
	<div class="treeContent"></div>
	</div>
</div>