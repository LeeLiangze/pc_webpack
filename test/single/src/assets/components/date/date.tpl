{{#if double}}
    {{#if label}}
        <label>
            {{{label}}}
        </label>
    {{/if}}
    <div>
        {{#if double.start}}
            <div>
                {{#if double.start.inputClassName}}
                    <input class="{{double.start.inputClassName}}" name="{{double.start.name}}" type="text" value="{{double.start.defaultValue}}">
                {{else}}
                    <input class="bg-date" name="{{double.start.name}}" type="text" value="{{double.start.defaultValue}}">
                {{/if}}
            </div>
        {{/if}}
        <span>~</span>
        {{#if double.end}}
            <div>
                {{#if double.end.inputClassName}}
                    <input class="{{double.end.inputClassName}}" name="{{double.end.name}}" type="text" value="{{double.end.defaultValue}}">
                {{else}}
                    <input class="bg-date" name="{{double.end.name}}" type="text" value="{{double.end.defaultValue}}">
                {{/if}}
            </div>
        {{/if}}
    </div>
{{else}}
    {{#if label}}
        <label>
            {{{label}}}
        </label>
    {{/if}}
    <div>
        {{#if inputClassName}}
            <input class="{{inputClassName}}" type="text" name="{{name}}" value="{{defaultValue}}">
        {{else}}
            <input class="bg-date" type="text" name="{{name}}" value="{{defaultValue}}">
        {{/if}}
    </div>
{{/if}}

