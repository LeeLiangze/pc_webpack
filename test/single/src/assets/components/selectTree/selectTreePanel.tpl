<div class="formlayer-content {{className}}">
    <div class="ztree" id="JS_tree">
        <span class="formlayer-content-loading">加载中...</span>
    </div>
</div>
<div class="formlayer-btns">
    {{#if checkAllNodes}}
    <label class="formlayer-btns-check" for="chkall">
        <input id="chkall" type="checkbox">全选
    </label>
    <div>
        {{#if check}}
        <a href="#nogo" class="confirm t-btn t-btn-xs t-btn-blue">确定</a>
        {{/if}}
        <a href="#nogo" class="empty t-btn t-btn-xs">清空</a>
    </div>
    {{else}}
        {{#if check}}
        <a href="#nogo" class="confirm t-btn t-btn-xs t-btn-blue">确定</a>
        {{/if}}
        <a href="#nogo" class="empty t-btn t-btn-xs">清空</a>
    {{/if}}
</div>