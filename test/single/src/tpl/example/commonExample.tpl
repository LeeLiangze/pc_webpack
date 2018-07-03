<div class="jf-right-outer">
    
    <!-- 页面有底部操作，追加 has-ctrl-bar -->
    <div class="jf-right-wrap has-ctrl-bar">
        <div class="searchContainer">
            <form>
            <div class="jf-form columns-4">
                
                <!-- 默认显示的检索字段 -->
                <ul class="jf-form-item">
                    <li class="requestTypeWrap">
             
                    </li>
                    <li class="selectAsyncTree">
                      <!--  <label for="fm02">
                            显示77水号
                        </label>
                        <div>
                            <input id="fm02" name="serialNumber" type="text">
                        </div>-->
                    </li>
                    <li id="startTime">
                       <!-- <label for="fm03">
                            开始时间
                        </label>
                        <div>
                        <input id="startTime" type="text" name="startTime" onclick="laydate();">
                        <i class="iconfont icon-riqi" onclick="laydate({elem: '#startTime'});"></i>
                    </div>-->
                </li>
                <li>
                    <label for="fm06">
                        email
                    </label>
                    <div>
                        <input id="fm06" type="text" name="email">
                    </div>
                </li>
                <li>
                    <label for="fm05">
                        手机号
                    </label>
                    <div>
                        <input id="fm05" type="text" name="mobile" placeholder="请输入手机号">
                    </div>
                </li>
                <li class="city">
                    <label for="fm06">
                        所属城市
                    </label>
                    <div>
                        <input id="fm06" type="text">
                    </div>
                </li>
                <li>
                    <label for="fm07">
                        时间选择
                    </label>
                    <div>
                        <input id="fm07" class="timepickerContainer" type="text">
                    </div>
                </li>
                <li class="userLevelWrap">
                    
                </li>
            </ul>
            
            <!-- 默认隐藏 -->
            <ul class="jf-form-item hide" id="search_more">
                <li>
                    <label for="fm09">
                        用户品牌
                    </label>
                    <div>
                        <select name="" id="fm09">
                            <option value="">用户品牌一</option>
                            <option value="">用户品牌二</option>
                            <option value="">用户品牌三</option>
                        </select>
                    </div>
                </li>
                <li>
                    <label for="fm10">
                        审核结果
                    </label>
                    <div>
                        <select name="shenhe" id="fm10">
                            <option value="">请选择</option>
                            <option value="0">审核结果一</option>
                            <option value="1">审核结果二</option>
                            <option value="2">审核结果三</option>
                        </select>
                    </div>
                </li>
                <li>
                    <label for="fm11">
                        紧急程度
                    </label>
                    <div>
                        <select name="" id="fm11">
                            <option value="">紧急程度一</option>
                            <option value="">紧急程度二</option>
                            <option value="">紧急程度三</option>
                        </select>
                    </div>
                </li>
                <li>
                    <label for="fm12">
                        受理方式
                    </label>
                    <div>
                        <select name="" id="fm12">
                            <option value="">受理方式一</option>
                            <option value="">受理方式二</option>
                            <option value="">受理方式三</option>
                        </select>
                    </div>
                </li>
                <li>
                    <label for="fm13">
                        联系qq
                    </label>
                    <div>
                        <input id="fm13" type="text" name="link_qq">
                    </div>
                </li>
                <li>
                    <label for="fm14">
                        联系电话2
                    </label>
                    <div>
                        <input id="fm14" type="text">
                    </div>
                </li>
                <li>
                    <label for="fm15">
                        操作状态
                    </label>
                    <div>
                        <select name="" id="fm15">
                            <option value="">操作状态一</option>
                            <option value="">操作状态二</option>
                            <option value="">操作状态三</option>
                        </select>
                    </div>
                </li>
                <li>
                    <label for="fm16">
                        接触轨迹编号
                    </label>
                    <div>
                        <input id="fm16" type="text">
                    </div>
                </li>
            </ul>

                <div class="jf-search-btns">
                    <p>共***个查询结果</p>
                    <a class="btn fl">导出EXL格式</a>
                    <a class="btn fl"  onclick="search_more.className='jf-form-item'; search_arrow.className='iconfont icon-shanglajiantou'">高级查询<i id="search_arrow" class="iconfont icon-xialajiantou"></i></a>
                    <a class="btn btn-blue fr btnSearch">查询</a>
                </div>

            </div>
            </form>
        </div>

        <div class="jf-search-result listContainer"></div>

    </div>

    <div class="jf-ctrl-bar buttonContainer">
        <a class="btn fl dialog-test">弹窗测试</a>
        <a class="btn fl btnIframeDialog">iframe弹窗</a>
        <a class="btn fl btnGetSelected">获取选中项</a>
        <a class="btn fl">收藏</a>
        <a class="btn  fr btnRemove">删除</a>
        <a class="btn  fr btnRemove js-total">获取所有值</a>
        <a class="btn fl btnTab">选项卡测试</a>
    </div>
</div>