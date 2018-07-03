{{#each beans}}
  <div class="menuItem">
    <h3 class="title" style="margin:10px">{{menuName}}</h3>
    {{#each secondMenu}}
      <div class="subMenu">
        <dl>
          <dt style="margin-left:20px;margin-top:10px">{{menuName}}</dt>
          <dd>
            <ul>
              {{#each thirdMenu}}
                <li style="margin-left:30px;margin-top:10px"> <a href="javascript:;" data-url="{{url}}" data-id="{{menuId}}">{{menuName}}</a> </li>
              {{/each}}
            </ul>
          </dd>
        </dl>
      </div>
    {{/each}}
  </div>
{{/each}}