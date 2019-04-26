// if(localStorage.getItem("username") == null){
//	window.location.href = "404.html";       
// }
/**
 * @Author    Suu
 * @DateTime  2018-06-28
 * @copyright 公共部分 - 抽离组合
 */
$(function(){
	// 加载layui部分
	layui.use(['form','element','table','laydate','layer','laytpl'],function(){
		$ = layui.jquery;
		form = layui.form;
		layer = layui.layer;
		table = layui.table;
		element = layui.element;
		laytpl = layui.laytpl;
	});
});
/**
 * @Author    Suu
 * @DateTime  2018-06-28
 * @copyright ajax 提交
 * @param     {string}    msg     提交前显示的信息
 * @param     {string}    url     提交的地址
 * @param     {string}    method  提交的方式
 * @param     {data}    data    提交的数据
 * @param     {string}    successFun 成功后的回调
 */
function ajax(msg,url,method,data,successFun){
	if(msg != ""){
		layer.msg(
			msg,
		    {
		        icon:config().layerMsg.icon.loading,
		        time:config().layerMsg.time.longtime,
		    }
		);
	}
	return new Promise(function(resovle,reject){
		$.ajax({
		    url: config().ajax.url+url,
		    type: method,
		    dataType: 'json',
		    data: data,
		    success : function(res){
                console.log(res);
		    	resovle(res)
		    },
		    error : function (jqXHR, textStatus, errorThrown){
		        // 考虑到错误信息采集的话需使用以上参数
		        layer.msg(
		            "操作失败,请刷新页面重试!",
		            {
		                icon:config().layerMsg.icon.error,
		            }
		        )
		        reject(errorThrown)
		    }
		});
	})
}
/**
 * @Author    Suu
 * @DateTime  2018-07-02
 * @copyright 动态渲染表格
 * @param     {string}    url             异步URL
 * @param     {string}    elem            绑定元素标识
 * @param     {string}    method          传输方式
 * @param     {array}    colsData         表格头信息
 * @return    {[type]}                    [description]
 */
function renderTable(url,elem,limit,method,colsData){
	layui.table.render({
		elem : elem,
		url : config().ajax.url+url,
		limit : limit ? limit : config().page.pageSize,
		method : method ? method : "get",
		request: {
	        pageName: "pageNum",//页码的参数名称，默认：page
	        limitName: "pageSize", //每页数据量的参数名，默认：limit
        },
	    page:true,
	    cellMinWidth: 80,
	    response: {
	      statusName: 'code' //数据状态的字段名称，默认：code
	      ,statusCode: 0 //成功的状态码，默认：0
	      ,msgName: 'msg' //状态信息的字段名称，默认：msg
	      ,countName: 'data.total' //数据总数的字段名称，默认：count
	      ,dataName: 'data.list' //数据列表的字段名称，默认：data
	    },      
	    cols: [createCols(colsData)],
	    done: function(res, curr, count){
	      //如果是异步请求数据方式，res即为你接口返回的信息。
	    	console.log(res);
	      //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
	      	layer.msg(res.msg,{icon:config().layerMsg.icon.success});
	    }
	});
}
/**
 * @Author    Suu
 * @DateTime  2018-07-02
 * @copyright 生成table列表头数据
 * @param     {[type]}    array  表头数据
 * @return    {[type]}    result 处理后的表头数据
 */
function createCols(array){
	result = new Array();
	for(var i=0;i<array.length;i++){
		var ca = array[i].split(",");
		if(ca.length>3){
			result.push(new obj(ca[0],ca[1],ca[2],ca[3]));
		}else{
			result.push(new obj(ca[0],ca[1],ca[2]));
		}
	}
	function obj(field,title,width,type) {
		if(field.slice(0,1)== "#"){
			this.toolbar = field;
		}else{
			this.field = field;
		}
		this.title = title;
		this.width = width ? width : "";
		if(type){
			var typeValue = type.split("=")[1];
			switch(typeValue)
			{
				case 'image' :
					this.templet = function(d){
						// console.log(d.LAY_INDEX)
						if(d[field] != null){
							// 多条数据的情况下
							if(d[field].match(RegExp(/,/))){
								// 去掉最后一个符号
								d[field] = d[field].substr(0, d[field].length - 1); 
								// 拼接数组
								var  imgArr = d[field].split(",");
								// console.log(imgArr);
								var innerHtml = "";
								innerHtml += "<div class='layer-photos-demo'>";
								$.each(imgArr,function(index, el) {
									innerHtml += "<img width=50 height=50 src='"+config().ajax.url+el+"'onclick='bigImg()'/>";
								});
								innerHtml += "</div>";
								return innerHtml;
							}else{
								// 一条的情况下
								return  "<div class='layer-photos-demo'><img width=50 height=50 src='"+config().ajax.url+(d[field]).split(",")[0]+"' onclick='bigImg()'/></div>";
							}
						}
					}
				break;
				case 'hide' :
					delete this.toolbar
				break; 
				default : break;
			}
		}
	}
	return result;
}
/**
 * @Author    Suu
 * @DateTime  2018-07-04
 * @copyright 判断是否存在参数,没有创建遮罩层
 * @param     {[type]}    param [description]
 * @return    {[type]}          [description]
 */
function checkUrlParam(param){
	$(".x-body").css("display","none");
	// console.log(getUrlParam(param));
	if(getUrlParam(param) == null){
		createPop("页面参数错误,请刷新重试")
		return false;	
	}else{
		$(".x-body").show();
	}
}
/**
 * @Author    Suu
 * @DateTime  2018-07-04
 * @copyright 获取URL中的参数
 * @param     {[type]}    name [description]
 * @return    {[type]}         [description]
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
/**
 * @Author    Suu
 * @DateTime  2018-07-04
 * @copyright 创建遮罩层
 * @param     {[type]}    errorMsg [description]
 * @return    {[type]}             [description]
 */
function createPop(errorMsg){
	var popDiv = "<div id='popDiv'style='z-index: 9999; display: none;width: 100%;height: 100%;background-color: #2F4056; opacity:0.5; -moz-opacity:0.5;'><h1 style='line-height:5em;color: #fff'>"+errorMsg+"</h1></div>";
	$("body").append(popDiv);
  	$("#popDiv").css("height",$(document).height());     
  	$("#popDiv").css("width",$(document).width());     
	$("#popDiv").show();
}
/**
 * @Author    Suu
 * @DateTime  2018-07-09
 * @copyright 获取时间
 * @return    {[type]}    返回当前时间
 */
function getTime(){
	var now = new Date();
	var year = now.getFullYear();       //年
	var month = now.getMonth() + 1;     //月
	var clock = year + "-";
	if(month < 10)	clock += "0";
	clock += month;
	return(clock);
}
/**
 * @Author    Suu
 * @DateTime  2018-07-11
 * @copyright 点击图片放大显示,再点击消失
 * @param     {[type]}    src [图片地址]
 * @return    {[type]}        [description]
 */
function bigImg(){

	layer.photos({
		photos: '.layer-photos-demo'
	});
}

function compileStr(code) { 
     var c = String.fromCharCode(code.charCodeAt(0) + code.length); 
     for (var i = 1; i < code.length; i++) {
         c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1)); 
     }
     return escape(c);
}
 
function uncompileStr(code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
}


//获取文件地址，显示预览用  
var getObjectURL = function(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic  
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)  
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome  
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
};

//图片过滤  
var imgFilter = function(files) {
    var a = true;
    for (var i = 0,
    file; file = files[i]; i++) {
        // console.log(file);  
        // console.log(file.type);  
        if (file.type.indexOf("image") == 0) {
            if (file.size >= 512000*4) {
                layer.msg('您这张"' + file.name + '"图片大小过大，应小于2M，请重新上传',{icon:config().layerMsg.icon.error});
                a = false;
            }
        } else {
            layer.msg('文件"' + file.name + '"不是图片。请重新上传',{icon:config().layerMsg.icon.error});
            a = false;
        }
    }
    return a;
} 

// 等待时间跳转
function F5(){
	setTimeout("window.parent.location.reload()",2000);
}
