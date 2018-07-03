<div class="sn-list-tip"  >
{{#each this}}
    {{#if this.items.length}}
    <div class="list-items" >
        {{#if title}}<h3>{{{title}}}</h3>{{/if}}
        {{#each items}}
        <div class="clearfix" >
            {{#deal_item this}}
                {{#each this}}
                <div class="list-level" style="width:{{this.width}};" >
                    <label>{{{this.name}}}：</label>
                    <span>{{{this.text}}}</span>
                </div>
                {{/each}}
            {{/deal_item}}
        </div>
        {{/each}}
    </div>
    {{/if}}
{{/each}}
</div>