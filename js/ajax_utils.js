var apiRoot='http://localhost:8083';

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
            success: function(data){
                var  backData=JSON.parse(data);
                options.successBack(backData.returnData);
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
               var  backData=JSON.parse(data);
                if(backData.code=='0'){
                    options.successBack(backData.msg);
                }else{
                    options.failBack(backData.code,backData.msg);
                }

            }
        });

    }
})