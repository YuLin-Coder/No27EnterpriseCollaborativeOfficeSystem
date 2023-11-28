/**
 * Created by YTY on 2016/11/4.
 */
var tagModule = angular.module("tagModule", ["pageModule", "ajaxModule"]);
tagModule.directive("tagPageList", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            select: "&",
            selectDefault: "@",
            height: "@",
            url: "@",
            entity: "=tagPageList"
        },
        template: '<div>' +
        '<form class="m-b form-inline" ng-submit="page.refreshTo(1)">' +
        '<input class="form-control" ng-model="name" placeholder="标签名称">' +
        '<button class="btn btn-primary m-l" type="submit">搜索</button>' +
        '</form>' +
        '<div class="list-group m-b-0" style="overflow-y: auto;max-height: {{height}}">' +
        '<a href="javascript:void(0)" ng-repeat="row in page.list" class="list-group-item list-group-item-info" ng-click="selectRow(row);" ng-mouseenter="row.$hover = true" ng-mouseleave="row.$hover = false">' +
        '<div class="row">' +
        '<p class="col-xs-1 m-b-0">' +
        '<span class="icon-arrow-left" ng-show="row.$hover"></span>' +
        '</p>' +
        '<p ng-bind="row.name" class="col-xs-10 m-b-0"></p>' +
        '</div></a></div></div>',
        link: function (scope, element) {
            scope.listScroll = false;
            $(element).find(".list-group").scroll(function () {
                if (scope.listScroll) {
                    return;
                }
                var viewH = $(this).height()
                var contentH = $(this).get(0).scrollHeight;
                var scrollTop = $(this).scrollTop();
                if (contentH - viewH - scrollTop <= 20) { //到达底部100px时,加载新内容
                    scope.listScroll = true;
                    scope.page.next();
                }
            });
            scope.selectRow = function (row) {
                if (typeof scope.selectDefault == "undefined") {
                    scope.select({$tag: row});
                } else {
                    for (var i in scope.entity) {
                        if (scope.entity[i].name == row.name) {
                            return;
                        }
                    }
                    scope.entity.push(deepCopy(row, {}));
                }
            };
            scope.name = "";
            scope.url = typeof scope.url == "undefined" ? "/server/tag/getTags" : scope.url;
            scope.load = function (current, size) {
                ajax.ajax(scope.url, "POST",
                    {
                        userId: userId,
                        current: current,
                        size: size,
                        name: scope.name
                    }).success(function (data) {
                        if (data.success) {
                            if (scope.listScroll) {
                                scope.page.pushPage(data);
                            } else {
                                scope.page.refreshPage(data);
                            }
                            scope.listScroll = false;
                        }
                    });
            };
            scope.page = page.page(scope.load);
            scope.page.refreshTo(1);
        }
    }
})

tagModule.directive("tagList", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            close: "&",
            closeDefault: "@",
            height: "@",
            title: "@",
            entity: "=tagList"
        },
        template: '<div>' +
        '<h4 class="text-center text-success"><span ng-bind="title"></span>' +
        '<span class="label label-success m-l-lg" ng-bind="entity.length"></span>' +
        '</h4>' +
        '<div class="list-group m-b-0" style="max-height: {{height}};overflow-y: auto">' +
        '<div ng-repeat="row in entity track by $index" class="list-group-item list-group-item-success">' +
        '<button type="button" class="close" ng-click="closeRow($index)">&times;</button>' +
        '<p class="m-b-0" ng-bind="row.name"></p>' +
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

tagModule.directive("tagListView", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            title: "@",
            icon: "@",
            entity: "=tagListView"
        },
        template: '<div class="m-t row">' +
        '<p class="text-muted col-xs-2">' +
        '<span class="{{icon}} m-r"></span><span ng-bind="title"></span>' +
        ' </p>' +
        '<div class="col-sm-10">' +
        '<p ng-repeat="row in tags" class="label label-info m-r-lg pull-left" style="display: block;padding: 5px 6px" ng-bind="row"></p>' +
        '</div></div>',
        link: function (scope) {
            scope.$watch('entity', function () {
                if (typeof scope.entity == "string") {
                    if (scope.entity.indexOf("[") == 0) {
                        scope.tags = [];
                        var tags = eval("(" + scope.entity + ")");
                        for (var i in tags) {
                            scope.tags.push(tags[i].name);
                        }
                    } else {
                        scope.tags = scope.entity.split(',');
                    }
                } else if (typeof scope.entity == "array") {
                    scope.tags = [];
                    for (var i in scope.entity) {
                        scope.tags.push(scope.entity[i].name);
                    }
                }
            });
        }
    }
});


tagModule.directive("tagListInnerView", function (page, ajax) {
    return {
        restrict: 'A',
        replace: false,
        scope: {
            entity: "=tagListInnerView"
        },
        template: '<span class="text-info" ng-if="entity != null && entity.length > 0 && entity != \'[]\'"><span class="icon-tag m-r"></span><span ng-repeat="row in tags" class="m-r" ng-bind="row"></span></span>',
        link: function (scope) {
            scope.$watch('entity', function () {
                if (typeof scope.entity == "string") {
                    if (scope.entity.indexOf('[') == 0) {
                        var entity = eval(scope.entity);
                        scope.tags = [];
                        for (var i in entity) {
                            scope.tags.push(entity[i].name);
                        }
                    } else {
                        scope.tags = scope.entity.split(',');
                    }
                } else if (typeof scope.entity == "array") {
                    scope.tags = [];
                    for (var i in scope.entity) {
                        scope.tags.push(scope.entity[i].name);
                    }
                }
            });
        }
    }
});