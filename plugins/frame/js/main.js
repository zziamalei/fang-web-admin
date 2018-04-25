/**
 * @Description: 主页面
 * @Copyright: 2017 www.fallsea.com Inc. All rights reserved.
 * @author: fallsea
 * @version 1.7.1
 * @License：MIT
 */
layui.use(['fsMenu', 'layer', 'fsTab', 'fsCommon', 'fsConfig'], function () {
    var fsTab = layui.fsTab,
        fsConfig = layui.fsConfig,
        fsCommon = layui.fsCommon,
        statusName = $.result(fsConfig, "global.result.statusName", "errorNo"),
        msgName = $.result(fsConfig, "global.result.msgName", "errorInfo"),
        fsMenu = layui.fsMenu;

    fsMenu.render();

    //初始化显示菜单
    showMenu($("#fsTopMenu li.layui-this").attr("dataPid"));

    if (window.attachEvent) {
        window.attachEvent("hashchange", hashChanged);
    } else if (window.addEventListener) {
        window.addEventListener("hashchange", hashChanged, false);
    }

    hashChanged();

    function hashChanged() {
        //获取路由信息
        var hash = window.location.hash;
        if (!$.isEmpty(hash) && hash.length > 1) {
            var menuId = hash.substring(1);
            //获取layId
            var dom = $('#fsLeftMenu a[menuId="' + menuId + '"]').parent();
            if (dom.length > 0) {
                fsTab.add(dom);
                fsTab.menuSelectCss(dom.attr("lay-id"));

            }
        }
    }


    $("#fsTopMenu").on("click", "li", function () {
        var dataPid = $(this).attr("dataPid");
        showMenu(dataPid);
    });


    //显示菜单
    function showMenu(dataPid) {
        if (!$.isEmpty(dataPid)) {
            $('#fsLeftMenu>li').hide();
            $('#fsLeftMenu>li[dataPid="' + dataPid + '"]').show();
        }
    }

    //渲染tab
    fsTab.render();

    //新增tab
    function addTab(title, dataUrl, layId) {
        fsTab.add(title, dataUrl, layId);
    }

    //手机设备的简单适配
    var treeMobile = $('.site-tree-mobile'),
        shadeMobile = $('.site-mobile-shade')

    treeMobile.on('click', function () {
        $('body').addClass('site-mobile');
    });

    shadeMobile.on('click', function () {
        $('body').removeClass('site-mobile');
    });


    //菜单绑定

    $(".fsSwitchMenu").on("click", function () {
        if ($(this).find("i.fa-outdent").length > 0) {
            $(this).find("i").removeClass("fa-outdent").addClass("fa-indent");
        } else {
            $(this).find("i").removeClass("fa-indent").addClass("fa-outdent");
        }
        $(".layui-layout-admin").toggleClass("showMenu");
    });


    /**
     * 右边菜单
     */
    $.contextMenu({
        selector: '.layui-tab-title li',
        callback: function (key, options) {
            var layId = $(this).attr("lay-id");
            switch (key) {
                case "close":
                    fsTab.del(layId);
                    break;
                case "closeOther":

                    $(this).parent().children("li").each(function (i, e) {

                        if ($(this).find(".layui-tab-close").is(":visible")) {

                            var newLayId = $(this).attr("lay-id");
                            if (layId != newLayId) {
                                fsTab.del(newLayId);
                            }
                        }
                    });
                    break;
                case "closeAll":

                    $(this).parent().children("li").each(function (i, e) {
                        if ($(this).find(".layui-tab-close").is(":visible")) {
                            var newLayId = $(this).attr("lay-id");
                            fsTab.del(newLayId);
                        }
                    });
                    break;
                case "reflush":

                    $('#main-content').attr('src', $('#main-content').attr('src'));
                    break;
                default:
                    break;
            }
        },
        items: {
            "close": {
                name: "关闭标签", icon: "fa-close", disabled: function () {
                    if ($(this).find(".layui-tab-close").is(":visible")) {
                        return false;
                    }
                    return true;
                }
            },
            "closeOther": {name: "关闭其他", icon: "fa-window-close-o"},
            "closeAll": {name: "关闭全部", icon: "fa-window-close"},
            "reflush": {name: "刷新", icon: "fa-refresh"}
        }
    });


    $('.fa-refresh').on("click",function () {

       $($('.layui-body').find('iframe')).each(function (index,obj) {
           $(obj).attr('src',  $(obj).attr('src'));
       });
    });


});