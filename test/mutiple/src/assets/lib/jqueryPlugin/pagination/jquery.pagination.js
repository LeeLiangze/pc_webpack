/**
 * 2013-7-13 修改。第一次加载时，不调用2次。 by shandl
 _page.pagination( json.total , {  
    'items_per_page'      : pageParams.items_per_page,  
    'num_display_entries' : 10,  
    'num_edge_entries'    : 2,  
    'link_to': '#tradeRecordsIndex' ,
    'prev_text'           : "上一页",  
    'next_text'           : "下一页",  
    'call_callback_at_once' : false,  //控制分页控件第一次不触发callback.
    'callback'            : function(page_index, jq){  
								getDataList(page_index , false , pageParams );  
							}  
});  
 * 
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function(maxentries, opts){
	opts = jQuery.extend({
		items_per_page:10,
		num_display_entries:10,
		current_page:0,
		skip_page:false,//add by  zhanglizhao
		num_edge_entries:0,
		link_to:"#",
		total:false,
		prev_text:"Prev",
		next_text:"Next",
		ellipse_text:"...",
		prev_show_always:true,
		next_show_always:true,
		call_callback_at_once : true,
		callback:function(){return false;}
	},opts||{});
	var objBase = {}
		/**
		 * Calculate the maximum number of pages
		 */
		function numPages() {
			return Math.ceil(maxentries/opts.items_per_page);
		}
		
		/**
		 * Calculate start and end point of pagination links depending on 
		 * current_page and num_display_entries.
		 * @return {Array}
		 */
		function getInterval()  {
			var ne_half = Math.ceil(opts.num_display_entries/2);
			var np = numPages();
			var upper_limit = np-opts.num_display_entries;
			var start = current_page>ne_half?Math.max(Math.min(current_page-ne_half, upper_limit), 0):0;
			var end = current_page>ne_half?Math.min(current_page+ne_half, np):Math.min(opts.num_display_entries, np);
			return [start,end];
		}
		
		/**
		 * This is the event handling function for the pagination links. 
		 * @param {int} page_id The new page number
		 */
		function pageSelected(page_id, evt){
			objBase.currentPage = current_page = page_id;
			drawLinks();
			var continuePropagation = opts.callback(page_id, panel);
			if (!continuePropagation) {
				if (evt.stopPropagation) {
					evt.stopPropagation();
				}
				else {
					evt.cancelBubble = true;
				}
			}
			return continuePropagation;
		}
		
		/**
		 * This function inserts the pagination links into the container element
		 */
		function drawLinks() {
			panel.empty();
			var interval = getInterval();
			var np = numPages();
			// This helper function returns a handler function that calls pageSelected with the right page_id
			var getClickHandler = function(page_id) {
				return function(evt){return pageSelected(page_id,evt);}
			};
			// Helper function for generating a single link (or a span tag if it's the current page)
			var appendItem = function(page_id, appendopts){
				page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
				appendopts = jQuery.extend({text:page_id+1, classes:""}, appendopts||{});
				var lnk ;
				if(page_id == current_page){
					lnk = jQuery("<span class='current'>"+(appendopts.text)+"</span>");
				}
				else
				{
					lnk = jQuery("<a>"+(appendopts.text)+"</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', opts.link_to.replace(/__id__/,page_id));
						
				}
				if(appendopts.classes){lnk.addClass(appendopts.classes);}
				panel.append(lnk);
			};
			if(opts.total){
				jQuery("<span class='total'>"+opts.total+"</span>").appendTo(panel);
			}
			// Generate "Previous"-Link
			if(opts.prev_text && (current_page > 0 || opts.prev_show_always)){
				// appendItem(current_page-1,{text:opts.prev_text, classes:"prev"});
				appendItem(current_page-1,{text:'', classes:"prev"});
			}
			// Generate starting points
			if (interval[0] > 0 && opts.num_edge_entries > 0)
			{
				var end = Math.min(opts.num_edge_entries, interval[0]);
				for(var i=0; i<end; i++) {
					appendItem(i);
				}
				if(opts.num_edge_entries < interval[0] && opts.ellipse_text)
				{
					jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
				}
			}
			// Generate interval links
			for(var i=interval[0]; i<interval[1]; i++) {
				appendItem(i);
			}
			// Generate ending points
			if (interval[1] < np && opts.num_edge_entries > 0)
			{
				if(np-opts.num_edge_entries > interval[1]&& opts.ellipse_text)
				{
					jQuery("<span>"+opts.ellipse_text+"</span>").appendTo(panel);
				}
				var begin = Math.max(np-opts.num_edge_entries, interval[1]);
				for(var i=begin; i<np; i++) {
					appendItem(i);
				}
				
			}
			// Generate "Next"-Link
			if(opts.next_text && (current_page < np-1 || opts.next_show_always)){
				// appendItem(current_page+1,{text:opts.next_text, classes:"next"});
				appendItem(current_page+1,{text:'', classes:"next"});
			}
			if(opts.skip_page){
				var $inputBox = jQuery("<span class='input-box'><em>跳转到第</em><input type='text' /><em>页</em></span>");
				var $selectPerPage = jQuery("<span class='per-page'><em>每页条数：</em><select class='selectPerPage'><option>"+ opts.items_per_page +"</option></select></span>");
				var $select=$selectPerPage.find("select");

				if (opts.custom_pages && opts.custom_pages.length){
					jQuery.each(opts.custom_pages,function(i, item){
						$select.append('<option>'+ item +'</option>');
					});
					$select.on('change',jQuery.proxy(function(evt){
						objBase.perPage = opts.items_per_page = jQuery(evt.currentTarget).val();
						pageSelected(0,evt);
					},this))
					// $inputBox.append($selectPerPage);
				}
				$selectPerPage.appendTo(panel);
				$inputBox.appendTo(panel);
				jQuery('<a href="javascript:;" >'+opts.skip_page+'</a>').appendTo(panel)
					.bind("click",function(evt){
						var pageNum = parseInt(panel.find("input").val());
						if(pageNum&&pageNum>1){
							pageNum=(pageNum>np)?np:pageNum;
						}else{
							pageNum=1
						}
						return pageSelected(pageNum-1,evt);
					});

				

			}
		}
		
		// Extract current_page from options
		var current_page = opts.current_page;
		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0)?1:maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;
		// Store DOM element for easy access from all inner functions
		var panel = jQuery(this);

		// Attach control functions to the DOM element 
		this.selectPage = function(page_id){ pageSelected(page_id);};
		this.prevPage = function(){ 
			if (current_page > 0) {
				pageSelected(current_page - 1);
				return true;
			}
			else {
				return false;
			}
		};
		this.nextPage = function(){ 
			if(current_page < numPages()-1) {
				pageSelected(current_page+1);
				return true;
			}
			else {
				return false;
			}
		};
		// When all initialisation is done, draw the links
		drawLinks();
        // call callback function
		if (opts.call_callback_at_once) { // 修改。第一次加载时，不调用2次。
			opts.callback(current_page, this);
		}
        
	return objBase;
};


