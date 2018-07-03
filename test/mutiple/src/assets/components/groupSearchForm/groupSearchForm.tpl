<div class = "sn-groupSearchForm {{className}}">
	{{#if title}}
		<p>{{title}}</p>
	{{/if}}
	<form class="searchForm">		
		<ul class="searchOptions">
			{{#each items}}
			{{#if this.className}}
				<li class = "{{this.className}}"></li>
			{{else}}
				<li></li>	
			{{/if}}
		    {{/each}}
		</ul>
	</form>
	<div class = "sn-groupSearchForm-buttons"></div>
</div>
	