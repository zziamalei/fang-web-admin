var apiRoot='http://localhost:8089';

var access_token= window.localStorage.access_token;


$.extend({
    myAjaxList: function(options) {

        var _default = {
            type : 'get',
            url : '',
            data:{},
            successBack : function(){},
            failBack:function () {

            }
        };

        var options=jQuery.extend({},_default,options);
        $.ajax({
            type: options.type,
            url: apiRoot+options.url,
            beforeSend: function(request) {
                request.setRequestHeader("access_token", access_token);
            },
            data: options.data,

            success: function(data){
                options.successBack(data.data);
            }
        });

    }
});

$.extend({
    myAjaxData: function(options) {
        var _default = {
            type : 'get',
            url : '',
            data:{},
            successBack : function(){},
            failBack:function () {

            }
        };

        var options=jQuery.extend({},_default,options);
        $.ajax({
            type: options.type,
            url: apiRoot+options.url,
            data: options.data,
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            beforeSend: function(request) {
                request.setRequestHeader("access_token", access_token);
            },
            success: function(data){
                try{
                    if(data.code==20001){
                        layer.msg('登录超时',{time:1500},function () {
                            window.localStorage.access_token=null;
                            parent.parent.window.location.href='/admin-web/login.html';
                            parent.window.location.href='/admin-web/login.html';
                            window.location.href='/admin-web/login.html';
                        });

                        return;
                    }

                    options.successBack(data.data);
                }catch(err)
                {
                    options.successBack(data.data);
                }


            }
        });

    }
});
$.extend({
    myAjax: function(options) {

        var _default = {
            type : 'get',
            url : '',
            data:{},
            successBack : function(){},
            failBack:function () {

            }
        };


        var options=jQuery.extend({},_default,options);
        $.ajax({
            type: options.type,
            url: apiRoot+options.url,
            data: options.data,
            traditional:true,
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            headers:{access_token:access_token},
            beforeSend: function(request) {
                request.setRequestHeader("access_token", access_token);
            },
            success: function(data){
                var backData=data;
                try {
                     backData = JSON.parse(data);
                } catch (e) {
                }


                if(backData.code==20001){
                    layer.msg('登录超时',{time:1500},function () {
                        window.localStorage.access_token=null;
                        parent.parent.window.location.href='/admin-web/login.html';
                        parent.window.location.href='/admin-web/login.html';
                        window.location.href='/admin-web/login.html';
                    });
                    return;
                }

                if(backData.code=='0'){
                    options.successBack(backData.msg,backData.data);
                }else{
                    options.failBack(backData.code,backData.msg);
                }

            }
        });

    }
});



$.extend({
    myList: function(options) {
        var _default = {
            id : 'table',
            url : '',
            cols:[],
            successBack : function(){},
            failBack:function () {

            },
            setlayerTable:function () {

            }

        };

        var options=jQuery.extend({},_default,options);



        var table;
        layui.use('table', function(){
            table= layui.table;

            options.setlayerTable(table);

            //第一个实例
            table.render({
                elem: '#'+options.id
                // ,height: 315
                ,url:apiRoot+ options.url //数据接口
                ,headers: {access_token: access_token}
                ,contentType:'application/json'
                ,where:options.where
                ,method:'post'
                ,page: true //开启分页
                ,request: {
                    pageName: 'page' //页码的参数名称，默认：page
                    ,limitName: 'size' //每页数据量的参数名，默认：limit
                }
                ,loading:true
                ,response: {
                    statusName: 'code' //数据状态的字段名称，默认：code
                    ,statusCode: 0 //成功的状态码，默认：0
                    ,msgName: 'msg' //状态信息的字段名称，默认：msg
                    // ,countName: 'data.totalElements' //数据总数的字段名称，默认：count
                    // ,dataName:'data.content'
                }
                ,cols: [options.cols]
            });


            if(options.bindClickOpen){
                $('a[lay-event=' + options.bindClickOpen + ']').click(function () {
                    myopen(options.bindClickOpen);
                });
            }

            function myopen(layEvent, name,value,obj) {
                var areaWidth = '700px';
                var areaHeight = '400px';

                if ($('a[lay-event=' + layEvent + ']').attr('areaWidth')) {
                    areaWidth = $('a[lay-event=' + layEvent + ']').attr('areaWidth');
                }
                if ($('a[lay-event=' + layEvent + ']').attr('areaHeight')) {
                    areaHeight = $('a[lay-event=' + layEvent + ']').attr('areaHeight');
                }


                var title='弹出框';
                if($('a[lay-event=' + layEvent + ']').attr('title')){
                    title=$('a[lay-event=' + layEvent + ']').attr('title');
                }


                var url=$('a[lay-event=' + layEvent + ']').attr('url') ;
                if(name){
                    url+='/'  + value;
                }
                if (layEvent === 'open' || layEvent === 'open1' || layEvent === 'open2' || layEvent === 'open3' || layEvent === 'open4') { //查看
                    layer.open({
                        type: 2,
                        title:title,
                        area: [areaWidth, areaHeight],
                        fixed: false, //不固定
                        maxmin: true,
                        content: url
                    });

                } else if (layEvent === 'confirm') { //删除
                    layer.confirm('确定删除本行？',{title:'提示'}, function (index) {

                        $.myAjax({
                            url: url,
                            // data: {'uid': value},
                            type: 'post',
                            successBack: function (data) {
                                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                layer.close(index);
                                //向服务端发送删除指令
                            },
                            failBack: function (code, msg) {
                                layer.msg(msg, {icon: 2, time: 2000});
                            }
                        });



                    });
                }
            }

            if(options.tool){

                //监听工具条
                table.on('tool('+options.id+')', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象



                    myopen(layEvent, $('a[lay-event=' + layEvent + ']').attr('idName') , data[$('a[lay-event=' + layEvent + ']').attr('idName')],obj);

                });

            }



        });


        if(options.layer){
            options.layer=layer;
        }
        if(options.table){
            options.table=table;
        }
    }
});


$.extend({
    myEdit:function (options) {
        var _default = {
            title : '',
            id : 'uid',
            url : '',
            successBack : function(){},
            failBack:function () {

            },
            setForm:function () {

            }
        };

        var options=jQuery.extend({},_default,options);

        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引

        $('.close-btn').click(function () {
            parent.layer.close(index);

        });




        var form
        layui.use(['form', 'layedit', 'laydate'], function(){
            form = layui.form
                ,layer = layui.layer
                ,layedit = layui.layedit
                ,laydate = layui.laydate;


            //自定义验证规则
            form.verify({
                title: function(value){
                    if(value.length < 5){
                        return '标题至少得5个字符啊';
                    }
                }
                ,pass: [/(.+){6,12}$/, '密码必须6到12位']
                ,content: function(value){
                    layedit.sync(editIndex);
                }
            });

            //监听提交
            form.on('submit(save)', function(data){
                layer.alert(JSON.stringify(data.field), {
                    title: '最终的提交信息'
                });


                $.myAjax({
                    url:$('.layui-form').attr('action'),
                    data:$('.layui-form').serialize(),
                    type:'post',
                    beforeSend: function(request) {
                        request.setRequestHeader("access_token", access_token);
                    },
                    successBack:function (msg) {
                        layer.msg(msg, {icon: 1,time:1000},function () {
                            parent.table.reload('table');
                            parent.layer.close(index);
                        });
                    },
                    failBack:function (code,msg) {
                        layer.msg(msg, {icon: 2,time:2000});
                    }

                });

                return false;
            });


        });
    }
});


function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function GetParentQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = parent.window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}



function  getAuth() {
   return  JSON.parse(window.localStorage.auth);
}