/**
 *  配置
 */

function config(){
	// 返回的配置文件数组
	var configArr = {
		// ajax 相关
		ajax : {
			// 请求头
			url : "http://192.168.1.102:8080/erp/",
		},
		// layui 消息层
		layerMsg : {
			//  图标
			icon : {
				loading : 16,
				error : 2,
				success : 1,
				waring : 9,
			},
			//  时间
			time : {
				longtime : 100000,
			}
		},
		page:{
			// 每页条数
			pageSize: 	5,
		},
		// 上传文件相关
		uploadFile:{
			number : 1,
			size : 1024*3
		},
		// sms
		sms : {
			time : 60
		}
		
	}
	return configArr;
}