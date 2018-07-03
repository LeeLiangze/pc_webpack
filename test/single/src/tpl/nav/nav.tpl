
<div class="wrap">
	<!--各个命令按钮-->
	<ul>
		<li style="margin-right:15px;cursor: pointer;position:relative;" class="toolSlideBtn">工具
			<img class="toolImg" src="../../assets/img/nav/zlt-xljt.png"/>
			<div class="toolSlide" id="slideTool">
				<img src="../../assets/img/nav/yhm-xlk.png" alt="" style="position: absolute;right:5px;top:-5px;width: 130px;height: 5px;"/>
				<div class="tool">
					<p><img src="../../assets/img/nav/gj-jt.png"/>截图<span>Ctrl+Alt+A</span></p>
				</div>
				<div class="tool">
					<p><img src="../../assets/img/nav/gj-jsq.png"/>计算器<span>Win+R输入calc</span></p>
				</div>
				<div class="tool">
					<p style="border: none;"><img src="../../assets/img/nav/gj-jsb.png"/>记事本<span>Win+R输入notepad</span></p>
				</div>
			</div>
		</li>
		<li class="nav_btn">知识库</li>
		<li style="margin:0;" class="nav_btn">公告</li>
		<li style="color:red;">(0)</li>
		<li style="margin:0;" class="nav_btn">便签</li>
		<li style="color:red;">(0)</li>
		<li class="nav_btn">收藏夹</li>
		<li style="margin-right:15px;">|</li>
		<li style="cursor: pointer;" id="nameSlide"  style="width:50px;">{{userName}}<img src="../../assets/img/nav/zlt-xljt.png"/></li>
	</ul>
    <!--姓名下拉-->
    <div class="nameSlide">
    	<img src="../../assets/img/nav/yhm-xlk.png" alt="" />
    	<div class="loginSuccess">
    		<p style="font-size: 13px;">{{loginTime}}&nbsp;&nbsp;登录成功</p>
    		<!--<p style="margin-top: 5px;">IP:&nbsp;&nbsp;{{userIp}}</p>-->
    		<p style="margin-top: 5px;">{{department}}</p>
    		<p style="margin-top: 5px;position:relative;"  class="staff">工号:&nbsp;&nbsp;{{idStaff}}
    		     <span  class="hoverStaff">{{staffId}}</span>
    		</p>
    	</div>
        <!--接续统计-->
    	<div class="operation">
			<p id="placeTotal"><img src="../../assets/img/nav/yhm-jxtj.png" />接续统计</p>
		</div>
		<!--工作日志-->
		<div class="operation">
			<p><img src="../../assets/img/nav/yhm-rzgz.png" />工作日志</p>
		</div>
		<!--视图模式选择-->
		<div class="operation">
			<p><img src="../../assets/img/nav/yhm-stms.png" />视图模式</p>
			<div class="viewMode">
					{{#view}}
					<div class="view">
						<img src={{picUrl}}/>
						<span>{{viewDesc}}</span>
					</div>
					{{/view}}


			</div>
		</div>
		<!--接续菜单选择-->
		<div class="operation">
			<p><img src="../../assets/img/nav/yhm-jxcd.png" />接续菜单</p>
			<div class="selectMenu">
				<div class="setPlace ">
					<img src="../../assets/img/nav/jxcd-wytb.png" />
					<span>位于头部</span>
				</div>
				<div class="setPlace ">
					<img src="../../assets/img/nav/jxcd-wyzc.png" />
					<span>位于左侧</span>
				</div>
			</div>
		</div>
		<!--皮肤设置选择-->
		<div class="operation">
			<p><img src="../../assets/img/nav/yhm-hf.png" />皮肤设置</p>
			<div class="setSkin">
				<p style="color: black;">主题</p>
				{{#skins}}
						<div class = "skin">
							<img src = {{thumbnlPath}} />
							<span style="margin-top: 5px;">{{skinName}}</span>
						</div>
				{{/skins}}


			</div>
		</div>
		<!--注销-->
		<div class="operation" id="logCancel">
			<p><img src="../../assets/img/nav/yhm-zx.png" />注销</p>
		</div>
		<!--退出系统-->
		<div class="operation" id="loginOut">
			<p style="border: none;"><img src="../../assets/img/nav/yhm-tcxt.png" />退出系统</p>
		</div>
    </div>
</div>

<div class="nav_showNotice alpha" id="_showNotice" style="background:black;">
    <div class="box">
	    <marquee style = "color:white;"height="20"width="60%" scrollamount="3" loop="infinite"  onmouseout="this.start()" onmouseover="this.stop()">
	           <span id="gonggao_content" style="cursor: pointer;"></span>
	    </marquee>
    </div>
    <div class="hideNotice">×</div>
</div>


<div class="popAnoceShow" id="popAnoceShow">
     <div class ="popAnoceTitle"><img  style="margin:0 5px; position: relative; top: 2px;" src="../../assets/img/nav/icon-gonggao.png"/>公告
        <span style="float:right;margin-right:10px;color:white;font-size:20px; cursor: pointer;" id="shutDown">×</span>
     </div>
     <div id="popAnoceContent">
			     
     </div>
     <div class="moreAnoceList">更多<span>>></span></div>
</div>
