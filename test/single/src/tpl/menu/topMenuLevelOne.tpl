<ul>
{{#if beans.length}}
  	{{#each beans}}
  	<li menuId="{{menuId}}" menuFlag="{{menuFlag}}">{{menuName}}
  		<img src="../../assets/img/menu/menu-arrow.png">
  	</li>
  	{{/each}}
{{else}}
  	<li></li>
{{/if}}
</ul>