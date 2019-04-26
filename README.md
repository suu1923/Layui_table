# 基于Layui
## 使用方法
## 1 在文件中依次引入 layui相关脚本，然后是config.js,util.js
###    <div class="layui-form-item">
###        <table id="orderTable" lay-filter="orderTable"></table>
###    </div>
## 2. renderTable("stra/listDept","#orderTable",10,"get",new 
 ##           Array(
##              "deptId,ID,180",
 ##             "deptName,部门名称,200",
   ##           "#orderInfo,操作"
   ##       ));
 ## 第一个参数： 接口地址
 ## 第二个参数：表格的名字
 ## 第三个参数：请求方式
 ## 第四个参数：表格所需要的字段（数组格式   数组中，第一个为接口字段，第二个为表格要显示的名称，第三个为距离，如果有图片，加上第4个 例如 type=image 在 util.js 仅封装了图片，有需要可以继续追加）
