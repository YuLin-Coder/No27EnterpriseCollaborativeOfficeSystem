<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>个人信息</title>
    <!--基础css & js-->
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/font-awesome/3.2.1/css/font-awesome.min.css" rel="stylesheet">
    <link href="/jsp/common/css/bootstrap-extend.css" rel="stylesheet">
    <link href="/jsp/common/css/validate.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdn.bootcss.com/angular.js/1.5.0/angular.min.js"></script>
    <script src="/jsp/common/js/angular-md5.min.js"></script>
    <script src="https://cdn.bootcss.com/angular-file-upload/2.5.0/angular-file-upload.min.js"></script>
    <script src="/jsp/common/js/angular-cookie.min.js"></script>
    <script src="/jsp/common/template/baseModule.js"></script>
    <!--七牛云存储-->
    <script src="/jsp/qiniu/js/plupload.full.min.js"></script>
    <script src="/jsp/common/js/qiniu.min.js"></script>
    <script src="/jsp/qiniu/js/qiniu.my.js"></script>
    <!--日期处理-->
    <link href="/jsp/common/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
    <script src="/jsp/common/js/bootstrap-datetimepicker.min.js"></script>
    <script src="/jsp/common/js/bootstrap-datetimepicker.zh-CN.js"></script>
    <script src="/jsp/common/js/moment.min.js"></script>
</head>
<body ng-app="m" ng-init='index = "个人信息"'>
<jsp:include page="/jsp/common/nav.jsp"/>
<div ng-controller="c" class="container" style="width: 98%;">
    <div class="panel panel-info m-t-lg" style="padding: 20px;">
        <div class="row">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">头像</label>
                <div class="col-sm-4">
                    <div style="margin-bottom: 20px;">
                        <img ng-src="{{info.avatar}}" class="img-circle" alt="" width="100px" height="100px"/>
                    </div>
                    <div id="container" style="width: 330px;" ng-show="btn.status">
                        <a class="btn btn-default btn-lg" id="pickfiles" style="width:160px">
                            <i class="glyphicon glyphicon-plus"></i>
                            <span ng-show="qnNgObj.status.firstPick">选择文件</span>
                            <span ng-show="qnNgObj.status.againPick">重新选择</span>
                        </a>
                        <a class="btn btn-default btn-lg" style="width:160px"
                           ng-click="qnUp.start()" ng-show="!qnNgObj.status.upSuccess">
                            <span>确认上传</span>
                        </a>
                        <a class="btn btn-success btn-lg" style="width:160px"
                           ng-show="qnNgObj.status.upSuccess">
                            <i class="glyphicon glyphicon-ok"></i>
                            <span>上传成功</span>
                        </a>

                        <div style="margin-top: 20px;">
                            <img id="imgPrev" width="320px" height="230px" src="" alt="请选择文件!"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">用户名</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="info.username" class="form-control" disabled style="background-color: white;"/>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">电话</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="info.phone" class="form-control"/>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">住址</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="info.address" class="form-control"/>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">角色类型</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="info.roleView" class="form-control" disabled style="background-color: white;"/>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label"></label>
                <div class="col-sm-4">
                    <button class="btn btn-primary" ng-show="!btn.status" ng-click="btn.changeStat(initFile())">编辑</button>
                    <button class="btn btn-danger" ng-show="btn.status" ng-click="btn.cancel()">取消</button>
                    <button class="btn btn-success" ng-show="btn.status" ng-click="btn.submit()">提交</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    var m = angular.module("m", ["nm","qiniu","angular-md5"]);
    var c = m.controller("c", function ($rootScope,$scope,page,ajax,$filter,entity,uploader) {
        $scope.$watch('$viewContentLoaded', function () {
            $scope.getOneUser = function () {
                ajax.ajax("/user/getOneUser", "GET", {
                    id: $rootScope.user.user.id
                }).success(function (data) {
                    console.log(data);
                    if(data.success){
                        $scope.userOrigin = data.value;
                        $scope.info = angular.copy($scope.userOrigin);
                        console.log($scope.info);
                        $scope.info.roleFunc = function () {
                            $scope.info.roleView = $scope.info.role === "admin" ? "管理员" :
                                ($scope.info.role === "user" ? "普通用户" : "志愿者");
                        };
                        $scope.info.roleFunc();
                    }
                }).error(function (data) {
                    console.log(data);
                });
            };
            $scope.getOneUser();
            /**获取七牛云文件上传组件实例*/
            $scope.qnNgObj = {};
            $scope.qnNgObj.status = {
                firstPick: true, againPick: false, upSuccess: false,
                changeStatus: function (f, a, u) {
                    $scope.qnNgObj.status.firstPick = f;
                    $scope.qnNgObj.status.againPick = a;
                    $scope.qnNgObj.status.upSuccess = u;
                }
            };
            $scope.qnUpInit = function () {
                $scope.qnUp = uploader.getUploader($scope,{"pickfiles":"pickfiles","container":"container"},
                    function (resultFile) {
                        $scope.qnFile = resultFile;//文件上传成功后保存在angularjs的作用域中
                        console.log("文件外链: " + $scope.qnFile);
                });
            };
            $scope.initFile = function () {
                if($scope.qnUp == "undefined" || $scope.qnUp == null){
                    $scope.qnUpInit();
                }
            };
            /**编辑状态改变*/
            $scope.btn = {
                status: false,
                changeStat: function (callback) {
                    $scope.btn.status = !$scope.btn.status;
                    callback && callback();
                },
                cancel: function () {
                    $scope.btn.changeStat();
                    $scope.info = angular.copy($scope.userOrigin);
                    console.log($scope.info);
                    $scope.info.roleFunc = function () {
                        $scope.info.roleView = $scope.info.role === "admin" ? "管理员" :
                            ($scope.info.role === "user" ? "普通用户" : "志愿者");
                    };
                    $scope.info.roleFunc();
                    $scope.qnNgObj.status.changeStatus(true,false,false);
                    $scope.qnFile = "";
                    $("#imgPrev").attr("src","");
                },
                submit: function () {
                    if($scope.info.avatar != null &&
                        ($scope.qnFile == "" || $scope.qnFile == null)){
                        this.file = $scope.info.avatar;
                    }else {
                        this.file = $scope.qnFile;
                    }

                    ajax.ajax("/user/updateOneUser", "GET", {
                        id: $rootScope.user.user.id,
                        username: $scope.info.username,
                        address: $scope.info.address,
                        phone: $scope.info.phone,
                        avatar: this.file,
                    }).success(function (data) {
                        console.log(data);
                        if(data.success){
                            alert("修改成功");
                            $scope.getOneUser();
                            $scope.btn.changeStat();
                            $scope.qnNgObj.status.changeStatus(true,false,false);
                        }
                    }).error(function (data) {
                        console.log(data);
                    });
                }
            }
        });
    });
</script>
</body>
</html>
