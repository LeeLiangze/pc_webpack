<div class="connection-menu-top clearfloat">
	<img src="../../assets/img/comMenu/connection-menu-logo.png" class="float-left connection-menu-logo-top"/>
	<div class="connection-menu-titlebox float-left">
		<h1 class="connection-menu-title">新一代客服系统</h1>
		<span class="connection-menu-description" style="float:left">
			{{serviceTypeName}}
		</span>
	</div>
	<div class="connection-menu-logo-box">
		<img src="../../assets/img/comMenu/logo_gray.png" class="connection-menu-logo-left"/>
		<div style="position: absolute;top: 49px;padding: 0 3px;color: lightgrey;">{{serviceTypeName}}</div>
	</div>
	<input type="hidden" id="tidying_surplus_time" value style="width:20px;height:37px"/>
	<!--常规渲染-->
	{{#each dataSource}}
	<div class="connection-list-box box-{{this.imageUrl}}">
		<a class="iconfont-com {{this.imageUrl}}" menuUrl={{this.menuUrl}} openModule={{this.openModule}} target-id={{this.displayNo}} data_title={{this.displayName}} href="javascript:"></a>
		<span class="connection-list connection-list-{{this.imageUrl}} iconfont-com" menuUrl="null" openModule="F">{{this.displayName}}</span>
		<div class="disabled"></div>
					
	</div>
	{{#if this.isTeam}}
	     <div class="showTeam"></div>
	{{/if}}
	{{/each}}
</div>
