<div class="sn-list {{className}}" style="width:{{#if width}}{{formatUnit width}}{{else}}100%{{/if}};">
    <!--{{#if height}}style="height:{{formatUnit height}};"{{/if}}-->
    <div class="sn-list-table sn-table">
        <div class="sn-list-header" style="">
            <div class="sn-list-header-locker">
                <table width="{{lockerWidth field}}">
                    <colgroup>
                        {{#if_checkbox field.boxType compare='checkbox'}}
                        <col></col>
                        {{/if_checkbox}}

                        {{#if_button field.button}}
                        {{#if field.button.locked}}
                        <col style="width:{{#if field.button.width}}{{field.button.width}}{{else}}100{{/if}}px;"></col>
                        {{/if}}
                        {{/if_button}}

                        {{#if field.items}}
                        {{#each field.items}}
                        {{#if locked}}
                        <col style="width:{{#if width}}{{width}}{{else}}100{{/if}}px;"></col>
                        {{/if}}
                        {{/each}}
                        {{/if}}
                    </colgroup>
                    <thead><tr>
                        {{#if_checkbox field.boxType compare='checkbox'}}
                        <th class="checkAllWraper"><input type="checkbox" /></th>
                        {{/if_checkbox}}

                        {{#if_button field.button}}
                        {{#if field.button.locked}}
                        <th scope="col"></th>
                        {{/if}}
                        {{/if_button}}

                        {{#if field.items}}
                        {{#each field.items}}
                        {{#if locked}}
                        <th scope="col" class="{{className}}">{{text}}</th>
                        {{/if}}
                        {{/each}}
                        {{/if}}
                    </tr></thead>
                </table>
            </div>
            <div class="sn-list-header-wrap">
                <table class="sn-list-resizable">
                
                    <thead><tr>
                        {{#if field.items}}
                        {{#each field.items}}
                        {{#if_false locked}}
                        <th {{#if width}}style="width:{{width}}px;"{{/if}} scope="col" class="{{className}}">{{text}}</th>
                        {{/if_false}}
                        {{/each}}
                        {{/if}}

                        {{#if_button field.button}}
                        {{#if_false field.button.locked}}
                        <th style="width:{{#if field.button.width}}{{field.button.width}}{{else}}100{{/if}}px;" scope="col"></th>
                        {{/if_false}}
                        {{/if_button}}

                        {{#if_popupLayer field.popupLayer}}
                        <th style="width:50px;" scope="col"></th>
                        {{/if_popupLayer}}
                    </tr></thead>
                </table>
            </div>
        </div>

        <div class="sn-list-content-locker sn-list-hide">
            <table width="{{lockerWidth field}}">
                <colgroup>
                    {{#if_checkbox field.boxType compare='checkbox'}}
                    <col></col>
                    {{/if_checkbox}}

                    {{#if_button field.button}}
                    {{#if field.button.locked}}
                    <col style="width:{{#if field.button.width}}{{field.button.width}}{{else}}100{{/if}}px;"></col>
                    {{/if}}
                    {{/if_button}}

                    {{#if field.items}}
                    {{#each field.items}}
                    {{#if locked}}
                    <col style="width:{{#if width}}{{width}}{{else}}100{{/if}}px;"></col>
                    {{/if}}
                    {{/each}}
                    {{/if}}
                </colgroup>
                <tbody>
                </tbody>
            </table>
        </div>

        <div class="sn-list-content sn-list-hide">
            <table class="sn-list-also">
                <tbody>
                </tbody>
            </table>
        </div>

        <div class="sn-list-blockOverlay">
            
        </div>

    </div>
    <div class="sn-list-footer">    
        <div class="buttons btns {{page.button.className}}">
            {{#if_object page.button compare='object'}}
            {{#each page.button.items}}
            <input type="button" value="{{text}}" class="btn btnCustom{{@key}}"/>
            {{/each}}
            {{/if_object}}
        </div>
        <div class="sn-list-pagination"></div>        
    </div>
    
</div>