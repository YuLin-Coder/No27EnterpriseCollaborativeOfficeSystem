<%@ page import="com.justerdu.io.user.model.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    /*User user = (User) session.getAttribute("user");
    Integer userId = user.getId();*/
%>

<link type="text/css" rel="stylesheet" href="/jsp/common/css/nav.css">

<script>
    angular.module("nm",["ipCookie","baseModule"])
        .controller("nc",function($scope, $location, ipCookie, $rootScope, $interval,ajax) {
            $scope.logout = function () {
                window.location.href = "/jsp/login.html";
            };

            $scope.navs3 = [
                {"id": 1, "name": "了解社区", "url": "/jsp/visitor/communityinfoInfo.jsp", "icon": "icon-screenshot", "subs": []},
                {"id": 2, "name": "通知公告", "url": "/jsp/visitor/noticeInfo.jsp", "icon": "icon-screenshot", "subs": []},
                {"id": 3, "name": "社区景貌", "url": "/jsp/visitor/sceneInfo.jsp", "icon": "icon-screenshot", "subs": []}];
            $scope.navs = $scope.navs3;

            //点击左侧导航栏
            $scope.collapse = $location.search().collapse && $location.search().collapse == "true";
            if ($scope.collapse) {
                $("body").addClass("nav-collapse");
            }
            $scope.collapseF = function () {
                $scope.collapse = !$scope.collapse;
                $location.search("collapse", $scope.collapse ? "true" : "false");
                if ($scope.collapse) {
                    $("body").addClass("nav-collapse");
                } else {
                    $("body").removeClass("nav-collapse");
                }
            };
            $scope.collapseNav = function (index) {
                var nav = $scope.navs[index];
                nav.in = !nav.in;
                $("#collapse-" + nav.name).collapse(nav.in ? "show" : "hide");
            };

            var sideScroll = false;
            var preventDefault = function (e) {
                e.preventDefault();
            };
            $(".sidebar").on("mouseenter", function () {
                window.addEventListener('mousewheel', preventDefault);
            });
            $(".sidebar").on("mouseleave", function () {
                window.removeEventListener('mousewheel', preventDefault);
            });
            document.getElementById("sidebar-container").addEventListener("mousewheel", function (e) {
                if (sideScroll) {//等待动画完成
                    return;
                }
                var sidebar = $(".sidebar");
                var sidebarContainer = $("#sidebar-container");
                var floor = sidebar.height() - sidebarContainer.height();
                floor = floor > 0 ? 0 : floor;
                var topOrigin = sidebarContainer.css("margin-top");
                topOrigin = parseInt(topOrigin.substring(0, topOrigin.length - 2));//去掉单位px
                var top = topOrigin - e.deltaY;
                top = top > 0 ? 0 : top;
                top = top < floor ? floor : top;
                if (top != topOrigin) {
                    sideScroll = true;
                    sidebarContainer.animate({"marginTop": top}, "fast", "swing", function () {
                        sideScroll = false;
                    });
                }
            });
            /**顶部导航*/
            $scope.topMidWidth = function () {
                $("#topMidId").width(
                    window.innerWidth - (Number($("#topLeftId").width()) + 15 * 2)//15*2因为有margin
                    - $("#topRightId").width() - 4//4为了消除可能由于border有宽度而影响topMidId的宽度
                );
            };
            (function () {
                $interval(function () {
                    $scope.topMidWidth();
                },200,10);
                $(window).resize(function () {
                    $scope.topMidWidth();
                });
            })();
            
        });
</script>
<div ng-controller="nc">
    <!--顶部导航-->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div id="topLeftId" class="navbar-header">
                <a class="navbar-brand" href="javascript:void(0)">
                    <span><i class="icon-heart icon-large" style="color: red;"></i></span>
                </a>
            </div>
            <div id="topMidId" class="navbar-text text-center" ng-style="topNavObj.midStyle()"
                 style="margin-left:0;margin-right: 0;">
                <span style="font-size: 100%;word-break: keep-all;" class="text-danger">欢迎访问&nbsp;&nbsp;社区管理平台</span>
            </div>
            <ul class="nav navbar-nav navbar-right">
                <li id="topRightId" class="dropdown">
                    <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                        <span >用户登录</span><b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="javascript:void(0)" ng-click="logout()">
                            <span style="width: 25px;"><i class="icon-signout" style="margin-right: 15px;width: 25px;"></i></span>
                            登录入口</a></li>
                     <li><a href="javascript:void(0)" >
                            <span style="width: 25px;"><i class="icon-lock" style="margin-right: 19px;"></i></span>
                            联系作者</a></li>       
                        <!--<li class="divider"></li>-->
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
    <!--左侧导航-->
    <div class="sidebar" ng-class='{"collapse":collapse}'>
        <div id="sidebar-container">
            <ul class="nav nav-sidebar">
                <li>
                    <a href="javascript:void(0)" ng-click="collapseF()" class="text-center hover">
                        <span ng-class='{"icon-align-justify":!collapse, "icon-list":collapse}'></span>
                    </a>
                </li>
            </ul>
            <ul class="nav nav-sidebar" ng-repeat="nav in navs"
                ng-class='{"nav-line":nav.index==40||nav.index==60||nav.index==120}'><!--3条横线 border-top-->
                <li ng-class='{"active":index == nav.name && !nav.subs.length}'>
                    <!--没有子列表-->
                    <a ng-if="!nav.subs.length" ng-href="{{nav.url}}"
                       ng-mouseenter="nav.hover = true" ng-mouseleave="nav.hover = false">
                        <span class="{{nav.icon}}"></span>
                        <span class="m-l-lg" ng-bind="nav.name" ng-class='{"hide":collapse}'></span>
                    </a>
                    <!--有子列表-->
                    <a ng-if="nav.subs.length" ng-click='collapseNav($index)'
                       ng-init="nav.in = index == nav.name" href="javascript:void(0)"
                       ng-mouseenter="nav.hover = true" ng-mouseleave="nav.hover = false">
                        <span ng-class='{"icon-chevron-down":nav.in, "icon-chevron-right":!nav.in}'></span>
                        <span class="m-l-lg" ng-bind="nav.name" ng-class='{"hide":collapse}'></span>
                    </a>
                    <!--tooltip-->
                    <div ng-show="nav.hover && collapse" class="nav-tooltip ng-hide" ng-bind="nav.name"></div>
                </li>
                <!--子列表-->
                <ul ng-if="nav.subs.length" ng-class='{"collapse":nav.subs.length,"in":nav.in}'
                    id='{{"collapse-"+nav.name}}' class="nav nav-sidebar-sub">
                    <li ng-repeat="sub in nav.subs"
                        ng-class='{"active":nav.name == index && subIndex == sub.name}'>
                        <a ng-href="{{sub.url}}" ng-mouseenter="sub.hover = true" ng-mouseleave="sub.hover = false">
                            <span class="{{sub.icon}}"></span>
                            <span class="m-l-lg" ng-bind="sub.name" ng-class='{"hide":collapse}'></span>
                        </a>

                        <div ng-show="sub.hover && collapse" class="nav-tooltip ng-hide" ng-bind="sub.name"></div>
                    </li>
                </ul>
            </ul>
        </div>
    </div>
    <!--修改密码-->
    <div class="modal fade" id="modalid-modifyPWD">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <!--  >模态弹出窗标题<  -->
                    <h4 class="modal-title">修改密码</h4>
                </div>
                <div class="modal-body">
                    <!--  >模态弹出窗主体内容<  -->
                    <form class="form-horizontal" role="form">
                        <div class="form-group">
                            <label class="col-sm-2 col-sm-offset-2 control-label">旧密码</label>
                            <div class="col-sm-6">
                                <input type="password" class="form-control" name="username" ng-model="editPwd.oldP" >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 col-sm-offset-2 control-label">新密码</label>
                            <div class="col-sm-6">
                                <input type="password" class="form-control" name="email" ng-model="editPwd.newP" >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 col-sm-offset-2 control-label">确认密码</label>
                            <div class="col-sm-6">
                                <input type="password" class="form-control" name="email" ng-model="editPwd.newPC" >
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" ng-click="editPwd.submit()" data-dismiss="modal">确定</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
</div>