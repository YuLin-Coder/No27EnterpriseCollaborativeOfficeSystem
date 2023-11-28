<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>公司文档管理</title>
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
<body ng-app="m" ng-init='index = "文档下载"'>
<jsp:include page="/jsp/common/nav.jsp"/>
<div ng-controller="c" class="container" style="width: 98%;">
    <div class="panel panel-default m-t-lg">
        <div class="panel-heading">
            <h4>公司文档列表</h4>

            <div class="clearfix">

                <form class="form-inline pull-right" ng-submit="page.refreshTo(1)">
                    <input class="form-control m-l" type="text"
                           placeholder="文档名称/文档简介" ng-model="search">
                    <button class="btn btn-primary" type="submit">
                        <span class="icon-search m-r"></span> 搜索
                    </button>
                </form>
            </div>
        </div>
        <%@ include file="/jsp/common/table.jspf" %>
    </div>
    <%--模态框--%>
    <div entity-modal="modal" title="上传 文档" action="add" entity="entity">
        <entity-modal-body>
            <div entity-right-any="avatar" title="文档" entity="entity.entity" e="entity">
                <div id="container" style="width: 330px;">
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
                        <img id="imgPrev"  src="" alt="请选择文件!"/>
                    </div>
                </div>
            </div>
             <div entity-edit-text="docItem" type="text" title="文档标题" entity="entity.entity"
                 e="entity" vld="entity.validate"></div>
            <div entity-edit-text="introduce" type="text" title="文档简介" entity="entity.entity" 
            	 e="entity" vld="entity.validate"></div>
        </entity-modal-body>
    </div>
    <div entity-modal="modal-edit" title="编辑 文档信息" action="edit" entity="entityEdit">
        <entity-modal-body>
            <div entity-edit-text="docItem" type="text" title="文档标题" entity="entity.entity"
                 e="entity" vld="entity.validate"></div>
            <div entity-edit-text="introduce" type="text" title="文档简介" entity="entity.entity" 
            	 e="entity" vld="entity.validate"></div>
        </entity-modal-body>
    </div>
    <div entity-modal="modal-del" title="删除 文档信息" action="delete" entity="entityDel">
        <entity-modal-body>
            <h4>确认删除该条文档信息？</h4>
        </entity-modal-body>
    </div>
</div>
<script>
    var m = angular.module("m", ["nm","qiniu","angular-md5"]);
    var c = m.controller("c", function ($rootScope,$scope,page,ajax,$filter,entity,uploader) {
        $scope.search = "";

        /**
         * 表格-分页
         */
        $scope.page = page.page(function (current, size) {
            ajax.ajax("/document/getDocumentPageList", "GET", {
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
                name: "文档ID",
                value: function (row) {
                    return row.id;
                },
                width: "5%"
            }, {
                name: "文档标题",
                value: function (row) {
                    return row.docItem;
                },
                width: "10%"
            }, {
             	name: "文档介绍",
                value: function (row) {
                return row.introduce;
             },
             width: "20%"
             }, {
                name: "文档路径",
                value: function (row) {
                    return row.avatar;
                },
                width: "30%"
            }, {
                name: "上传时间",
                value: function (row) {
                    return $filter('fmtDateYMdHMcn')(row.time);
                },
                width: "20%"
            }
        ];
        $scope.operations = [
            {
                name: function () {
                    return "";
                },
                clas: function () {
                    return {
                        "btn btn-xs btn-success icon-download-alt": true
                    };
                },
                click: function (row) {
                	$scope.editObj = row;
                    console.log("文件外链: " + $scope.editObj.avatar);
                    window.location = $scope.editObj.avatar;
                }
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
            	docItem: "",
                introduce: "",
                avatar : ""
            }, {
                docItem: {},
                introduce: {}
            },  function () {
                console.log("opened!");
                if($scope.qnUp == "undefined" || $scope.qnUp == null){
                    $scope.qnUpInit();
                }
                //$scope.addrole = "user";
                //$scope.addsex = "男";
                $scope.qnNgObj.status.changeStatus(true, false, false);
                $("#imgPrev").attr("src", "");
            },function () {
               console.log("submited!");
                if($scope.qnFile !== null && $scope.qnFile !== "undefined"){
                    $scope.entity.entity.avatar = $scope.qnFile;
                }
                //console.log($scope.entity.entity.avatar);
                //console.log($("#selectRole").val());
                ajax.ajax("/document/addOneDocument", "GET", {
                        docItem: $scope.entity.entity.docItem,
                        introduce: $scope.entity.entity.introduce,
                        realname:$scope.entity.entity.realname,
                        avatar:$scope.entity.entity.avatar
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
                docItem: "",
                introduce: "",
                avatar : ""
            }, {
                docItem: {},
                introduce: {}
            }, function () {
                console.log("opened!");
                $scope.entityEdit.entity.docItem = $scope.editObj.docItem;
                $scope.entityEdit.entity.introduce = $scope.editObj.introduce;
            }, function () {
                ajax.ajax("/document/updateOneDocument", "GET", {
                    id: $scope.editObj.id,
                    docItem: $scope.editObj.docItem,
                    introduce: $scope.entityEdit.entity.introduce,
                    avatar:$scope.editObj.avatar
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
            }, function () {
                ajax.ajax("/document/deleteOneDocument", "GET", {
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
