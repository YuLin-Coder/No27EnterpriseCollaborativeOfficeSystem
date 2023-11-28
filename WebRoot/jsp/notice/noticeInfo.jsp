<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>公告信息</title>
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
<body ng-app="m" ng-init='index = "公司公告"'>
<jsp:include page="/jsp/common/nav.jsp"/>
<div ng-controller="c" class="container" style="width: 98%;">
    <div class="panel panel-default m-t-lg">
        <div class="panel-heading">
            <h4>公司公告列表</h4>

            <div class="clearfix">
            	<!-- 
                <label>
                    <button class="btn btn-success pull-left" ng-click="entity._openModal()">
                        <span class="icon-plus m-r"></span>新增&nbsp;公告信息
                    </button>
                </label>
				 -->
                <form class="form-inline pull-right" ng-submit="page.refreshTo(1)">
                    <input class="form-control m-l" type="text"
                           placeholder="公告标题/公告内容" ng-model="search">
                    <button class="btn btn-primary" type="submit">
                        <span class="icon-search m-r"></span> 搜索
                    </button>
                </form>
            </div>
        </div>
        <%@ include file="/jsp/common/table.jspf" %>
    </div>
    <%--模态框--%>
    <!--  
    <div entity-modal="modal" title="新增 公告信息" action="add" entity="entity">
        <entity-modal-body>
            <div entity-edit-text="noticeItem" type="text" title="公告标题" entity="entity.entity" e="entity"
                 vld="entity.validate"></div>
            <div entity-edit-text="noticeContent" type="text" title="公告内容" entity="entity.entity"
                 e="entity" vld="entity.validate"></div>
            <div entity-edit-text="createTime" type="date" title="创建时间" entity="entity.entity"
                 e="entity" vld="entity.validate"></div>
        </entity-modal-body>
    </div>
    <div entity-modal="modal-edit" title="编辑 公告信息" action="edit" entity="entityEdit">
        <entity-modal-body>
            <div entity-edit-text="noticeItem" type="text" title="公告标题" entity="entityEdit.entity"
                 e="entityEdit" vld="entityEdit.validate"></div>
            <div entity-edit-text="noticeContent" type="text" title="公告内容" entity="entityEdit.entity"
                 e="entityEdit" vld="entityEdit.validate"></div>
        </entity-modal-body>
    </div>
    <div entity-modal="modal-del" title="删除 公告信息" action="delete" entity="entityDel">
        <entity-modal-body>
            <h4>确认删除该条公告信息？</h4>
        </entity-modal-body>
    </div>
     -->
</div>
<script>
    var m = angular.module("m", ["nm","qiniu","angular-md5"]);
    m.filter('fmtDatetimeDetail', function ($filter) {
    	return function (time) {
        	return time ? $filter('date')(time, 'yyyy-MM-dd HH:mm:ss') : "";
    	}
	});
    var c = m.controller("c", function ($rootScope,$scope,page,ajax,$filter,entity,uploader) {
        $scope.search = "";
        //$scope.searchTypeArray = [{"cn":"水费","en":"water"}, {"cn":"电费","en":"electric"}, {"cn":"物业费","en":"management"}, {"cn":"其他","en":"other"}];
        //$scope.searchType = "water";

        /**
         * 表格-分页
         */
        $scope.page = page.page(function (current, size) {
            ajax.ajax("/notice/getNoticePageList", "GET", {
                    current: current,
                    size: size,
                    search: $scope.search
                }).success(function (data) {
                console.log(data);
                if (data.success) {
                    $scope.page.refreshPage(data);
                }
            });
        });
        $scope.ths = [
            {
                name: "公告标题",
                value: function (row) {
                    return row.noticeItem;
                },
                width: "20%"
            }, {
                name: "公告内容",
                value: function (row) {
                    return row.noticeContent;
                },
                width: "50%"
            }, {
                name: "创建时间",
                value: function (row) {
                    //return row.createTime;
                    return $filter('fmtDatetimeDetail')(row.createTime);
                },
                width: "30%"
            }
        ];
        
        $scope.$watch('$viewContentLoaded', function () {
            $scope.page.refreshTo(1);
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
            $scope.qnUpInit = function () {//新增
                $scope.qnUp = uploader.getUploader($scope,{"pickfiles":"pickfiles","container":"container"},
                    function (resultFile) {
                        $scope.qnFile = resultFile;//文件上传成功后保存在angularjs的作用域中
                        console.log("文件外链: " + $scope.qnFile);
                });
            };
            $scope.qnUp1Init = function () {//编辑
                $scope.qnUp1 = uploader.getUploader($scope,{"pickfiles":"pickfiles1","container":"container1"},
                    function (resultFile) {
                        $scope.qnFile1 = resultFile;//文件上传成功后保存在angularjs的作用域中
                        console.log("文件外链: " + $scope.qnFile1);
                    });
            };
        });
        /**
         * 操作
         */
        $scope.entity = entity.getEntity(
            {	 
            	noticeItem: "",
                noticeContent: "",
                createTime: ""
            }, {
                noticeItem: {},
                noticeContent: {},
                createTime: {}
            },  function () {
                console.log("opened!");
               
            },function () {
               console.log("submited!");
                
                ajax.ajax("/notice/addOneNotice", "GET", {
                        noticeItem: $scope.entity.entity.noticeItem,
                        noticeContent: $scope.entity.entity.noticeContent,
                        createTime:$scope.entity.entity.createTime
                    }).success(function (data) {
                        console.log(data);
                        if(data.success){
                            $scope.entity._success();
                            $scope.page.refresh();
                        }else {
                            alert(data.message);
                        }
                    }).error(function (data) {
                        console.log(data);
                        $scope.entity._error();
                    });
            }, "modal", null);
        $scope.entityEdit = entity.getEntity(
            {
                id: 0,
                noticeItem: "",
                noticeContent: "",
            }, {
            }, function () {
                console.log("opened!");
                /*if($scope.qnUp == "undefined" || $scope.qnUp == null){
                    $scope.qnUpInit();
                }
                $scope.addrole = "user";
                $scope.qnNgObj.status.changeStatus(true, false, false);
                $("#imgPrev").attr("src", "");*/
                $scope.entityEdit.entity.noticeItem = $scope.editObj.noticeItem;
                $scope.entityEdit.entity.noticeContent = $scope.editObj.noticeContent;
            }, function () {
                ajax.ajax("/notice/updateOneNotice", "GET", {
                    id: $scope.editObj.id,
                    noticeItem:$scope.editObj.noticeItem,
                    noticeContent: $scope.entityEdit.entity.noticeContent,
                }).success(function (data) {
                    console.log(data);
                    if(data.success){
                        $scope.entityEdit._success();
                        alert("修改成功");
                        $scope.page.refresh();
                    }else {
                        alert(data.message);
                    }
                }).error(function (data) {
                    console.log(data);
                    $scope.entityEdit._error();
                });
            }, "modal-edit", {});
            $scope.entityDel = entity.getEntity(
            {
               id:0
            }, {
                
            }, function () {
                console.log("opened!");
                /*if($scope.qnUp == "undefined" || $scope.qnUp == null){
                    $scope.qnUpInit();
                }
                $scope.addrole = "user";
                $scope.qnNgObj.status.changeStatus(true, false, false);
                $("#imgPrev").attr("src", "");*/
            }, function () {
                ajax.ajax("/notice/deleteOneNotice", "GET", {
                    id: $scope.delObj.id,
                }).success(function (data) {
                    console.log(data);
                    if(data.success){
                        $scope.entityDel._success();
                        alert("删除成功");
                        $scope.page.refresh();
                    }else {
                        alert(data.message);
                    }
                }).error(function (data) {
                    console.log(data);
                    $scope.entityDel._error();
                });
            }, "modal-del", {});
    });
</script>
</body>
</html>

