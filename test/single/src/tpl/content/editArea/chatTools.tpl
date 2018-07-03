<div style="position:relative;">
    <ul class="clearfix" id="chartBoxToolBar">
        <!-- 渠道协同 -->
        <li class="chlSynergy" id="chlSynergy">
             <div class="bg weiboContainer">
               <div class="bgRight">
                   <div class="bgCenter">
                       <a class="coordination" title="渠道协同">
                          <span id="channelSynergy" class="channelSynergy">
                              <img src="" alt=""/>
                          </span>
                           <img src="../../../assets/img/content/editArea/connection-list-down.png" alt="" class="connection-list-down" style="position: absolute;right: 2px;top: 13px;">
                           <span class="selDown"></span>
                       </a>
                   </div>
               </div>
           </div>
           <ul id="listWrap" class="listWrap">
               <li class="province webchat">
                  <img src="../../../assets/img/content/editArea/qdqh-wx.png" alt=""/>
               </li>
               <li class="province voice">
                  <img src="../../../assets/img/content/editArea/qdqh-yy.png" alt=""/>
               </li>
               <li class="province shortMsg">
                  <img src="../../../assets/img/content/editArea/qdqh-dx.png" alt=""/>
               </li>
               <li class="province microBlog">
                  <img src="../../../assets/img/content/editArea/qdqh-wb.png" alt=""/>
               </li>
               <li class="province fourG">
                  <img src="../../../assets/img/content/editArea/qdqh-4g.png" alt=""/>
               </li>
           </ul>
        </li>
        <!-- 表情按钮 -->
        <li class="showFacePic">
            <div class="bg weiboContainer">
                <div class="bgRight">
                    <div class="bgCenter">
                        <a class="face" unselectable="on" onmousedown="return false" title="表情"> <span class="selDown"></span> </a>
                    </div>
                </div>
            </div>
        </li>

        <!-- 本地图片按钮 -->
        <li class="showLocalPic">
            <div class="bg weiboContainer">
                <div class="bgRight">
                    <div class="bgCenter">
                        <a hidefocus="" class="image addfileA" title="本地图片">
                        <span style="position:relative;display:inline-block;overflow:hidden;width:30px;height:40px;">
                            <input hideFocus class="addfileI" type="file" size=1 name="files" id="fileNameMedia" style="position:absolute;font-size:0;width:30px;right:6px;bottom:11px;height: 35px;outline: none;border: 0;font-size:100%\0">
                        </span>
                        </a>
                    </div>
                </div>
            </div>
        </li>
        <!-- 图片库 -->
        <li class="showNetPic">
             <div class="bg weiboContainer">
                 <div class="bgRight">
                      <div class="bgCenter">
                          <a class="imglab" title="图片库"> <span class="selDown"></span> </a>
                      </div>
                  </div>
              </div>
        </li>
        <!--快捷回复-->
        <li class="quickTalk" id="quickTalk">
        	<div class="bg weiboContainer">
                <div class="bgRight">
                    <div class="bgCenter">
                        <a class="quickReply" unselectable="on" onmousedown="return false" title="快捷回复"> <span class="selDown"></span> </a>
                    </div>
                </div>
            </div>
        </li>
        <!--业务树-->
        <li class="businessTree">
        	<div class="bg weiboContainer">
        		<div class="bgRight">
        			<div class="bgCenter">
        				<a class="businessTreeicon" title="业务树"><span class="selDown"></span></a>
        			</div>
        		</div>
            </div>
        </li>
		<!--清空编辑器内容-->
		<li class="textClear">
            <div class="bg weiboContainer">
                <div class="bgRight">
                    <div class="bgCenter">
                        <a class="clear" title="清空"> <span class="selDown"></span> </a>
                    </div>
                </div>
            </div>
        </li>
        <!--查看历史-->
        <li class="searchHistory" id="searchHistory">
        	<div class="bg weiboContainer">
                <div class="bgRight">
                    <div class="bgCenter">
                        <a class="watchHistory" unselectable="on" onmousedown="return false" title="查看历史"> <span class="selDown"></span> </a>
                    </div>
                </div>
            </div>
        </li>
    </ul>
    <!-- 表情展示 -->
    <div id="my_face_div"></div>
    <div class='faceContent' id='faceContent_faceDiv'></div>
    <!-- 保存图片库中选中的图片url -->
    <input type="hidden" id="media_pictureLag_url" value="">
     <!--快捷回复-->
    <div class='quickReplys' id='chatBox_quickReply'></div>
</div>
