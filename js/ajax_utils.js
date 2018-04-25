var apiRoot='http://malei.iok.la/';

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
            data: options.data,
            success: function(data){
                options.successBack(data.returnData);
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
            success: function(data){
                if(data.code=='0'){
                    options.successBack(data.msg);
                }else{
                    options.failBack(data.code,data.msg);
                }

            }
        });

    }
})