<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>考勤打卡</title>
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
    
    <style type="text/css">
.radio{
    display: inline-block;
    position: relative;
    line-height: 18px;
    margin-right: 10px;
    cursor: pointer;
}
.radio input{
    display: none;
}
.radio .radio-bg{
    display: inline-block;
    height: 18px;
    width: 18px;
    margin-right: 5px;
    padding: 0;
    background-color: #a6ffff;
    border-radius: 100%;
    vertical-align: top;
    box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1) inset, 0 1px 4px rgba(0, 0, 0, 0.1) inset, 1px -1px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease;
}
.radio .radio-on{
    display: none;
}
.radio input:checked + span.radio-on{
    width: 10px;
    height: 10px;
    position: absolute;
    border-radius: 100%;
    background: #FFFFFF;
    top: 4px;
    left: 4px;
    box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.4) inset;
    background-image: linear-gradient(#ffffff 0, #e7e7e7 100%);
    transform: scale(0, 0);
    transition: all 0.2s ease;
    transform: scale(1, 1);
    display: inline-block;
}
</style>
</head>
<body ng-app="m" ng-init='index = "考勤打卡"'>
<jsp:include page="/jsp/common/nav.jsp"/>
<div ng-controller="c" class="container" style="width: 98%;">
    <div class="panel panel-info m-t-lg" style="padding: 20px;">
        <div class="row">
            <div class="form-group">
                
                <div class="col-sm-2 col-sm-offset-3 control-label">
                    
                        <img ng-src="{{info.avatar}}" class="img-circle" alt="" width="100px" height="100px" />
                        
                    </div>
                    <div class="col-sm-4">
                        <h3>{{info.username}}，您好!</h3>
                        <h4>在开始一天的工作前别忘了签到打卡，离开的时候记得签退哦~</h4>
                    </div>
  
                
            </div>
        </div>

        <div class="row" style="margin-top: 30px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-3 control-label">请选择打卡类型：</label>
                <div class="col-sm-4">
                   
<label  class="radio">
    <span class="radio-bg"></span>
    <input type="radio" name="checktype"  value="上班打卡" checked="checked" ng-model="check.check" /> 上班打卡
    <span class="radio-on"></span>
</label>
<br>
<label  class="radio">
    <span class="radio-bg"></span>
    <input type="radio" name="checktype" value="下班打卡" ng-model="check.check"/> 下班打卡
    <span class="radio-on"></span>
</label>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-3 control-label">备注</label>
                <div class="col-sm-4">
                    <input type="text" placeholder="打卡备注" ng-model="check.remark" class="form-control"/>
                </div>
            </div>
        </div>
        
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-3 control-label"></label>
                <div class="col-sm-4">
                  <!--   <button class="btn btn-primary" ng-show="!btn.status" ng-click="btn.changeStat(initFile())">编辑</button>
                    <button class="btn btn-danger" ng-show="btn.status" ng-click="btn.cancel()">取消</button> -->
                    <button class="btn btn-success"  ng-click="btn.submit()">打卡</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    var m = angular.module("m", ["nm","qiniu","angular-md5"]);
    var c = m.controller("c", function ($rootScope,$scope,page,ajax,$filter,entity,uploader) {
     $scope.check = {
      check: "上班打卡",
      remark:""
      }
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
                    if($scope.check.inn != null ||
                        ($scope.check.out == null)){
                        ajax.ajax("/check/addOneCheck", "GET", {
                        checkItem: $scope.check.check,
                        userId: $rootScope.user.user.id,
                        remark: $scope.check.remark, 
                    }).success(function (data) {
                        console.log(data);
                        if(data.success){
                            alert("打卡成功");
/*                             $scope.getOneUser();
                            $scope.btn.changeStat();
                            $scope.qnNgObj.status.changeStatus(true,false,false); */
                        }
                    }).error(function (data) {
                        console.log(data);
                    });
                    }

             
                }
            }
        });
    });
</script>
</body>
</html>
