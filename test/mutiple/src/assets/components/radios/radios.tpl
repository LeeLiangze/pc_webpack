<div class="sn-radios {{className}}">
    <ul class="chk-list">
        {{#each items}}
        <li class="{{className}}">
            <div {{#ifInDisabledValue value}}disabled=disabled class="disabled"{{/ifInDisabledValue}}
                {{#ifInDefaultValue value}}class="checked"{{/ifInDefaultValue}} >
                <input type="checkbox" 
                    {{#ifInDisabledValue value}}disabled=disabled{{/ifInDisabledValue}} {{#ifInDefaultValue value}}checked=checked{{/ifInDefaultValue}} 
                    value="{{value}}" id="input-{{@key}}">
                <ins></ins>
            </div>
            
            <label for="input-{{@key}}">
                {{label}}
            </label>
        </li>
        {{/each}}
    </ul>
</div>