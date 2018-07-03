<div class="errorCorrection">
    <div class="jf-form" id = "addCorrectForm">
    	<form>
    	<div class="jf-form columns-1">
    		<ul class="jf-form-item">
    			<li>
                    <label for="titleNm" class="necessary">便签标题(必填):</label>
                    <div>
                        <input id="titleNm" name="titleNm" type="text">
                    </div>
            	</li>
            	<li>
    				<label for="urgntExtentTypeCd" class="necessary">紧急程度(必填):</label>
    	            <div>
    	               <select name="urgntExtentTypeCd" id="urgntExtentTypeCd">
    		        		<option value="1">一般</option>
    		        		<option value="2">紧急</option>
    		        		<option value="3">特急</option>
    		        		<option value="4">故障</option>
    	       		   </select>
    	            </div>
        		</li>
            	<li>
                    <label for="rcvPrsnNameSet" class="necessary">接收人姓名(必填):</label>
                    <div>
    	               <select name="rcvPrsnIdSet" id="rcvPrsnIdSet">
    	       		   </select>
    	            </div>
                    <!--<div>
                        <input id="rcvPrsnNameSet" readonly="readonly" disabled="disabled" name="rcvPrsnNameSet" type="text">
                    </div>-->
            	</li>
            	<li>
                    <label for="newsCntt" id ="newsCnttLabel" class="necessary">
                        内容描述(必填):
                    </label>
                    <div>
                        <textarea id="newsCntt" name="newsCntt" type="text"></textarea>
                    </div>
            	</li>
        </div>
        <div class="jf-search-btns">
    		<a class="btn btn-blue fr" id="btnCorrectSave">发送</a>
        </div>
        </form>
    </div>
</div>
