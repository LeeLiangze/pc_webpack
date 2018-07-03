<div class="jf-right-outer">
    <div class="demo">
        <h3>表单验证组件</h3>
        <div class="demo-example">
            <!-- 组件结构 -->
            <div class="jf-form columns-4">
                <form  id="validatorContainer">
                    <div>
                        <label>手机号</label>
                        <input type="text" name="mobile" value=""/>
                        <label>开始时间</label>
                        <input type="text" name="time" value=""/>
                        <label>邮箱</label>
                        <input type="text" name="email" value=""/>
                        <label>品牌</label>
                        <input type="text" name="brand" value=""/>
                        <label>数字</label>
                        <input type="text" name="content" value=""/>
                        <span class="btn btn-success fileinput-button">
                            <i class="glyphicon glyphicon-plus"></i>
                            <span>请选择文件</span>
                            <!-- The file input field used as target for the file upload widget -->
                            <input id="fileupload" type="file" name="files" multiple>
                        </span>

                        <input type="button" class="btnSearch" value="验证"/>
                    </div>
                </form>
            </div>
            <!-- 组件结构 结束-->
        </div>
    </div>
</div>

