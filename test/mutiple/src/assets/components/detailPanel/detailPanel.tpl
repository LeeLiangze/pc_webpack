<div class="sn-detailPanel {{className}}">
    {{#if title}}<h3>{{{title}}}</h3>{{/if}}
    <ul class="detailList">
        {{#each items}}
        <li class="{{className}}">
            <label>{{label}}</label>：
            <span class="value">{{{key}}}</span>
            {{#if customHTML}}<span class="custom">{{{customHTML}}}</span>{{/if}}
            
        </li>
        {{/each}}
    </ul>
</div>