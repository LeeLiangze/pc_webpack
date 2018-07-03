<div class="sn-step">
  <ol class="sn-stepbar {{className}}">
    {{#each items}}
    <li>
      <div>
        <div class="{{className}} step-num">{{addOne @index}}</div>
        <div class="step-name">{{title}}</div>
      </div>
    </li>
    {{/each}}
  </ol>
  <div class="formContainer"></div>
</div>