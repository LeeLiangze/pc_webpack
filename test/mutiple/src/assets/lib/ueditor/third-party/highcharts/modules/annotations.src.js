!function(t,i){function e(t){var i,e;return e={xAxis:0,yAxis:0,title:{style:{},text:"",x:0,y:0},shape:{params:{stroke:"#000000",fill:"transparent",strokeWidth:2}}},i={circle:{params:{x:0,y:0}}},i[t]&&(e.shape=f(e.shape,i[t])),e}function n(t){return"[object Array]"===Object.prototype.toString.call(t)}function a(t){return"number"==typeof t}function r(t){return t!==o&&null!==t}function s(t,i,e,n,a){for(var r=t.length,s=0;s<r;)"number"==typeof t[s]&&"number"==typeof t[s+1]?(t[s]=i.toPixels(t[s])-n,t[s+1]=e.toPixels(t[s+1])-a,s+=2):s+=1;return t}var o,l,h,p=t.Chart,c=t.extend,u=t.each;h=["path","rect","circle"],l={top:0,left:0,center:.5,middle:.5,bottom:1,right:1};var d=i.inArray,f=t.merge,y=function(){this.init.apply(this,arguments)};y.prototype={init:function(t,i){var n=i.shape&&i.shape.type;this.chart=t,this.options=f({},e(n),i)},render:function(t){var i=this,e=this.chart,n=i.chart.renderer,a=i.group,r=i.title,s=i.shape,o=i.options,l=o.title,p=o.shape;a||(a=i.group=n.g()),!s&&p&&d(p.type,h)!==-1&&(s=i.shape=n[o.shape.type](p.params),s.add(a)),!r&&l&&(r=i.title=n.label(l),r.add(a)),a.add(e.annotations.group),i.linkObjects(),t!==!1&&i.redraw()},redraw:function(){var i,e,n,o,h,p,u,f=this.options,y=this.chart,x=this.group,g=this.title,b=this.shape,m=this.linkedObject,v=y.xAxis[f.xAxis],w=y.yAxis[f.yAxis],k=f.width,P=f.height,O=l[f.anchorY],j=l[f.anchorX],A=!1;if(m&&(e=m instanceof t.Point?"point":m instanceof t.Series?"series":null,"point"===e?(f.xValue=m.x,f.yValue=m.y,n=m.series):"series"===e&&(n=m),x.visibility!==n.group.visibility&&x.attr({visibility:n.group.visibility})),p=r(f.xValue)?v.toPixels(f.xValue+v.minPointOffset)-v.minPixelPadding:f.x,u=r(f.yValue)?w.toPixels(f.yValue):f.y,!isNaN(p)&&!isNaN(u)&&a(p)&&a(u)){if(g&&(g.attr(f.title),g.css(f.title.style),A=!0),b){if(i=c({},f.shape.params),"values"===f.units){for(o in i)d(o,["width","x"])>-1?i[o]=v.translate(i[o]):d(o,["height","y"])>-1&&(i[o]=w.translate(i[o]));i.width&&(i.width-=v.toPixels(0)-v.left),i.x&&(i.x+=v.minPixelPadding),"path"===f.shape.type&&s(i.d,v,w,p,u)}"circle"===f.shape.type&&(i.x+=i.r,i.y+=i.r),A=!0,b.attr(i)}x.bBox=null,a(k)||(h=x.getBBox(),k=h.width),a(P)||(h||(h=x.getBBox()),P=h.height),a(j)||(j=l.center),a(O)||(O=l.center),p-=k*j,u-=P*O,y.animation&&r(x.translateX)&&r(x.translateY)?x.animate({translateX:p,translateY:u}):x.translate(p,u)}},destroy:function(){var t=this,i=this.chart,e=i.annotations.allItems,n=e.indexOf(t);n>-1&&e.splice(n,1),u(["title","shape","group"],function(i){t[i]&&(t[i].destroy(),t[i]=null)}),t.group=t.title=t.shape=t.chart=t.options=null},update:function(t,i){c(this.options,t),this.linkObjects(),this.render(i)},linkObjects:function(){var t=this,i=t.chart,e=t.linkedObject,n=e&&(e.id||e.options.id),a=t.options,s=a.linkedTo;r(s)?r(e)&&s===n||(t.linkedObject=i.get(s)):t.linkedObject=null}},c(p.prototype,{annotations:{add:function(t,i){var e,a,r=this.allItems,s=this.chart;for(n(t)||(t=[t]),a=t.length;a--;)e=new y(s,t[a]),r.push(e),e.render(i)},redraw:function(){u(this.allItems,function(t){t.redraw()})}}}),p.prototype.callbacks.push(function(i){var e,a=i.options.annotations;e=i.renderer.g("annotations"),e.attr({zIndex:7}),e.add(),i.annotations.allItems=[],i.annotations.chart=i,i.annotations.group=e,n(a)&&a.length>0&&i.annotations.add(i.options.annotations),t.addEvent(i,"redraw",function(){i.annotations.redraw()})})}(Highcharts,HighchartsAdapter);