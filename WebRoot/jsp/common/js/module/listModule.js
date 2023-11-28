/**
 * Created by YTY on 2016/11/4.
 */
var listModule = angular.module("listModule", ["pageModule", "ajaxModule"]);
listModule.directive("list", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            close: "&",
            title: "@",
            height: "@",
            templateId: "@",
            closeDefault: "@",
            entity: "=list"
        },
        template: '<div>' +
        '<h4 class="text-center text-success"><span ng-bind="title"></span>' +
        '<span class="label label-success m-l-lg" ng-bind="entity.length"></span>' +
        '</h4>' +
        '<div class="list-group m-b-0" style="max-height: {{height}};overflow-y: auto">' +
        '<div ng-repeat="row in entity track by $index" class="list-group-item list-group-item-success">' +
        '<button type="button" class="close" ng-click="closeRow($index)">&times;</button>' +
        '<div ng-include="templateId" style="margin-right:2em">' +
        '</div></div></div></div>',
        link: function (scope) {
            scope.closeRow = function (index) {
                if (typeof scope.closeDefault == "undefined") {
                    scope.close({$index: index})
                } else {
                    scope.entity.splice(index, 1);
                }
            }
        }
    }
});
listModule.directive("listView", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            height: "@",
            templateId: "@",
            title: "@",
            icon: "@",
            entity: "=listView"
        },
        template: '<div class="m-t clearfix">' +
        '<p class="text-muted">' +
        '<span class="{{icon}} m-r"></span><span ng-bind="title"></span>' +
        ' </p>' +
        '<div class="list-group m-b-0" style="max-height: {{height}};overflow-y: auto">' +
        '<div ng-repeat="row in entity track by $index" class="list-group-item">' +
        '<div ng-include="templateId" ">' +
        '</div></div></div></div>'
    }
});

listModule.directive("listPage", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            service: "&",
            select: "&",
            selectDefault: "@",
            placeholder: "@placeholder",
            height: "@",
            load: "&",
            templateId: "@",
            entity: "=listPage"
        },
        template: '<div>' +
        '<form class="m-b form-inline" ng-submit="page.refreshTo(1)">' +
        '<input class="form-control" ng-model="name" placeholder="{{placeholder}}">' +
        '<button class="btn btn-primary m-l" type="submit">搜索</button>' +
        '</form>' +
        '<div class="list-group m-b-0" style="overflow-y: auto;max-height: {{height}}">' +
        '<a href="javascript:void(0)" ng-repeat="row in page.list" ng-click="selectRow(row)" class="list-group-item list-group-item-info" ng-mouseenter="row.$hover = true" ng-mouseleave="row.$hover = false">' +
        '<p class="m-b-0 pull-left">' +
        '<span class="icon-arrow-left" ng-show="row.$hover"></span>' +
        '</p>' +
        '<div ng-include="templateId" style="margin-left: 2em"></div>' +
        '</a></div></div>',
        link: function (scope, element, attr) {
            scope.listScroll = false;
            $(element).find(".list-group").scroll(function () {
                if (scope.listScroll) {
                    return;
                }
                var viewH = $(this).height();
                var contentH = $(this).get(0).scrollHeight;
                var scrollTop = $(this).scrollTop();
                if (contentH - viewH - scrollTop <= 20) { //到达底部100px时,加载新内容
                    scope.listScroll = true;
                    scope.page.next();
                }
            });
            scope.name = "";
            scope.callback = function (data) {
                if (data.success) {
                    if (scope.listScroll) {
                        scope.page.pushPage(data);
                    } else {
                        scope.page.refreshPage(data);
                    }
                    scope.listScroll = false;
                }
            };
            scope.selectRow = function (row) {
                if (typeof scope.selectDefault == "undefined") {
                    scope.select({$row: row});
                } else {
                    if (scope.selectDefault.length > 0) {
                        for (var i in scope.entity) {
                            if (scope.entity[i][scope.selectDefault] == row[scope.selectDefault]) {
                                return;
                            }
                        }
                    }
                    scope.entity.push(deepCopy(row, {}));
                }
            };
            scope.loadPage = function (current, size) {
                scope.load({$current: current, $size: size, $name: scope.name, $callback: scope.callback});
            };
            scope.page = page.page(scope.loadPage);
            scope.service({$page: scope.page});
            scope.page.refreshTo(1);
        }
    }
});