<div class="addClientTag">
	<span>已有标签（</span><span id="tags_tips">最多可定义15个标签</span><span>）</span><br/><br/>
	<div class="hasTagsDiv">
		<ul class="jf-tag" id="hasTags">
			<script id="hasTags_template" type="text/x-handlebars-template">
			   {{#each hasTagsData}}
				   <li class={{this}}  name={{this}}>
			       		<a class="del" name={{this}}>{{this}}<span class="span_del"></span></a>
			       </li>
		       {{/each}}
		    </script>
		</ul>
		<span>
			<input id="addClientTag_textTag" type="text" class="txt_tag" value="输入自定义标签，点击空白处保存" maxlength="12">
		</span>
	</div>
	<br/>
	<span>标签库：</span>
	<div style="width:95%;height:100px;">
		<ul class="jf-tag" id="tagsLib">
			<script id="tagsLib_template" type="text/x-handlebars-template">
			   {{#each tagsLibData}}
				   <li  class={{tagName}} name={{tagName}} value={{tagId}}>
				  		{{#if_eq isSelected compare=1}}
			       			<a class="added" name={{tagName}}>{{tagName}}<span class="span_added"></span></a>
				  		{{/if_eq}}
				  		{{#if_eq isSelected compare=0}}
			       			<a class="add" name={{tagName}}>{{tagName}}<span class="span_add"></span></a>
				  		{{/if_eq}}
			       </li>
		       {{/each}}
		    </script>
		</ul>
	</div>
	<div class="btns-center">
		<a class="btn btn-blue" id="addClientTag_saveBtn">保存</a>
    	<a class="btn" href="javascript:void(0)" id="addClientTag_cancelBtn">取消</a>
	</div>
<div>