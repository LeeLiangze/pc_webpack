{{#each beans}}
	  <div class="menuItem">
	    <!-- <h3 class="title">{{menuName}}</h3> -->
	    {{#each secondMenu}}
	      <div class="subMenu">
	        <dl>
	          <dt menuFlag="{{menuFlag}}">{{menuName}}</dt>
	          <dd>
	            <ul>
	              {{#each thirdMenu}}
		                <li class="liMenu menuDd"> 
		                  <a href="javascript:;" menuName="{{menuName}}" abbreviation="{{abbreviation}}" menuFlag="{{menuFlag}}" data-url="{{url}}" data-id="{{menuId}}" data-openMode="{{openModule}}">{{menuName}}
		                  </a> 
		                </li> 
	              {{/each}}
	            </ul>
	          </dd>
	        </dl>
	      </div>
	    {{/each}}
	  </div>
{{/each}}