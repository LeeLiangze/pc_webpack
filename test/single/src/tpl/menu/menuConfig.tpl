<ul class="menuVisible">
    {{#if beans.length}}
        {{#each beans}}
        <li data-url="{{menuUrl}}" data-id="{{menuId}}" data-openMode="{{openModule}}">
        	{{displayName}}        	
        	<ul style="display: none;" class="shortCut">
        		{{#if children.length}}
	        		{{#each children}}
	        		<li data-url="{{menuUrl}}" data-id="{{menuId}}" data-openMode="{{openModule}}">{{displayName}}</li>
	        		{{/each}}
        		{{else}}
			    <li style="display: none;"></li>
			    {{/if}}
        	</ul>
        </li>
        {{/each}}
    {{else}}
    <li></li>
    {{/if}}
</ul>