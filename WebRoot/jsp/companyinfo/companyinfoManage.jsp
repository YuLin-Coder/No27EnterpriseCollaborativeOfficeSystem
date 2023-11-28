<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>公司基本信息</title>
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
<body ng-app="m" ng-init='index = "公司信息管理"'>
<jsp:include page="/jsp/common/nav.jsp"/>
<div ng-controller="c" class="container" style="width: 98%;">
    <div class="panel panel-info m-t-lg" style="padding: 20px;">
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">公司名称</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="companyinfo.companyName" class="form-control" disabled style="background-color: white;"/>
                </div>
            </div>
        </div>
		<div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">公司介绍</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="companyinfo.introduce" class="form-control" />
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">公司地址</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="companyinfo.address" class="form-control"/>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">公司电话</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="companyinfo.phone" class="form-control"/>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 20px;">
            <div class="form-group">
                <label class="col-sm-2 col-sm-offset-2 control-label">公司邮编</label>
                <div class="col-sm-4">
                    <input type="text" ng-model="companyinfo.postcode" class="form-control"/>
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
            $scope.getOneCompanyInfo = function () {
                ajax.ajax("/companyinfo/getOneCompanyInfo", "GET", {
                    id: "1"
                }).success(function (data) {
                    console.log(data);
                    if(data.success){
						$scope.companyinfo = {};
						                    
                    	$scope.companyinfo.companyName = data.value.companyName;
                    	$scope.companyinfo.introduce = data.value.introduce;
                    	$scope.companyinfo.address = data.value.address
                    	$scope.companyinfo.phone = data.value.phone;
                    	$scope.companyinfo.postcode = data.value.postcode
                        
                    }
                }).error(function (data) {
                    console.log(data);
                });
            };
            $scope.getOneCompanyInfo();
            
            /**编辑状态改变*/
            $scope.btn = {
                status: false,
                changeStat: function (callback) {
                    $scope.btn.status = !$scope.btn.status;
                    callback && callback();
                },
                cancel: function () {
                    $scope.btn.changeStat();
                    $scope.companyinfo = angular.copy($scope.userOrigin);
                    console.log($scope.companyinfo);
                    $scope.qnNgObj.status.changeStatus(true,false,false);
                },
                submit: function () {
                    ajax.ajax("/companyinfo/updateOneCompanyInfo", "GET", {
                        id: "1",
                        companyName: $scope.companyinfo.companyName,
                        introduce: $scope.companyinfo.introduce,
                        address: $scope.companyinfo.address,
                        phone: $scope.companyinfo.phone,
                        postcode: $scope.companyinfo.postcode
                    }).success(function (data) {
                        console.log(data);
                        if(data.success){
                            alert("修改成功");
                            $scope.getOneCompanyInfo();
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
