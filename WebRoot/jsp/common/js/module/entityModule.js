var entityModule = angular.module("entityModule", ['filterModule']);
entityModule.service("entityService", function () {
    return {
        getEntity: function (entityPrototype, validatePrototype, openAdd, add, openEdit, edit, modalId) {
            var entity = {
                modalId: modalId,
                entity: angular.copy(entityPrototype),
                validatePrototype: validatePrototype,
                validate: {},
                editTarget: {},
                action: "add",
                refreshValidatePrototype: function () {
                    for (var key in validatePrototype) {
                        entity.validate[key] = {
                            key: key,
                            p: validatePrototype[key].v(entity.entity),
                            f: true,
                            v: function () {
                                entity.validate[this.key].f = false;
                                entity.validate[this.key].p = validatePrototype[this.key].v(entity.entity);
                            },
                            tip: validatePrototype[key].tip
                        };
                    }
                },
                p: function () {
                    for (var key in entity.validate) {
                        if (!entity.validate[key].p) {
                            return false;
                        }
                    }
                    return true;
                },
                success: function () {
                    $("#" + entity.modalId).modal("hide");
                    entity.progress = null;
                    if (entity.action == "add") {
                        entity.entity = angular.copy(entityPrototype);
                    }
                },
                error: function (message) {
                    alert(message);
                    entity.progress = null;
                },
                openAdd: function (obj) {
                    if (entity.action != "add") {
                        entity.entity = angular.copy(entityPrototype);
                        entity.action = "add";
                    }
                    openAdd(entity.entity, obj);
                    entity.refreshValidatePrototype();
                    $("#" + entity.modalId).modal("show");
                },
                openEdit: function (row, obj) {
                    entity.editTarget = row;
                    entity.entity = angular.copy(row, {});
                    entity.action = "edit";
                    openEdit(entity.entity, row, obj);
                    entity.refreshValidatePrototype();
                    $("#" + entity.modalId).modal("show");
                },
                submit: function () {
                    if (!entity.p()) {
                        return;
                    }
                    if (entity.action == "add") {
                        add(entity.entity, entity.success, entity.error, entity.progressChange);
                    } else {
                        edit(entity.entity, entity.editTarget, entity.success, entity.error, entity.progressChange);
                    }
                }
            };
            entity.refreshValidatePrototype();
            return entity;
        }
    }
});
/**
 * 文本 文本域 图片 文件 html
 * 查看 编辑
 */
entityModule.directive("entityModal", function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            modalId: "@entityModal",
            title: "@",
            entity: "=",
            action: "@",
            canSubmit: "=",
            submit: "="
        },
        templateUrl: '/jsp/common/js/template/modal_template.html'
    }
});

entityModule.directive("entityModalView", function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            modalId: "@entityModalView",
            title: "="
        },
        templateUrl: '/jsp/common/js/template/modal_view_template.html'
    }
});
entityModule.directive("entityModalImg", function () {
    return {
        restrict: 'A',
        scope: {
            url: "@entityModalImg"
        },
        link: function (scope, element) {
            scope.viewer = null;
            $(element[0]).on("click", "img", function () {
                if (scope.viewer == null) {
                    scope.viewer = $(element[0]).viewer({
                        "url": scope.url,
                        "zoomRatio": 0.3
                    });
                    $(this).click();
                }
            });
        }
    }
});

entityModule.directive("entityEditText", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            type: "@",
            name: "@entityEditText",
            title: "@",
            placeholder: "@ph",
            entity: "=",
            validate: "=vld",
            step: "=",
            min: "=",
            max: "="
        },
        template: '<div class="form-group">' +
        '<label class="col-md-2 col-md-offset-2 control-label">' +
        '<span ng-if="isNeedValidate" class="text-danger small icon-asterisk m-r"></span>' +
        '<span ng-bind="title"></span>' +
        '</label>' +
        '<div class="col-md-4">' +
        '<input class="form-control" type="{{type}}" placeholder="{{placeholder}}" ng-model="entity[name]" ' +
        'step="{{step}}" min="{{min}}" max="{{max}}" ng-focus="inputFocus()" ng-blur="inputBlur()">' +
        '</div>' +
        '<p ng-if="isNeedValidate" class="col-xs-4 m-t m-b-0 text-danger" ng-show="inputError(name,entity[name])" ng-bind="validate[name].tip"></p>' +
        '</div>',
        link: function (scope) {
            scope.isNeedValidate = typeof scope.validate != "undefined" && typeof scope.validate[scope.name] != "undefined";
            scope.inputFocus = function () {
                if (scope.isNeedValidate) {
                    //scope.validate[scope.name].f = true;
                }
            };
            scope.inputBlur = function () {
                if (scope.isNeedValidate) {
                    //scope.validate[scope.name].v(scope.entity[name]);
                }
            };
            scope.inputError = function (n, v) {
                //console.log(scope.validate);
                if (v === "") {
                    return true;
                }
                return !scope.validate[n].v(v);
            }
        }
    }
});

entityModule.directive("entityControlTextarea", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            name: "@entityControlTextarea",
            title: "@",
            placeholder: "@",
            entity: "="
        },
        template: '<div class="form-group">' +
        '<label class="col-sm-2 control-label">' +
        '<span ng-bind="title"></span>' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<textarea rows="5" class="form-control" placeholder="{{placeholder}}" ng-model="entity[name]"></textarea>' +
        '</div>' +
        '</div>'
    }
});
entityModule.directive("entityControlImg", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            name: "@entityControlImg",
            portrait: "@",
            path: "@",
            title: "@",
            square: "@",
            entity: "="
        },
        template: '<div class="form-group">' +
        '<label class="col-sm-2 control-label">' +
        '<span ng-bind="title"></span>' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<img ng-show="entity[name] == null" class="first img-responsive img-rounded center-block m-b" ng-src="{{src}}" style="max-height: 200px;">' +
        '<img ng-show="entity[name] != null" class="img-responsive img-rounded center-block m-b" ngf-thumbnail="entity[name]" ngf-resize="{height: 200}" style="max-height: 200px">' +
        '<button class="btn btn-success center-block" ngf-select ng-model="entity[name]" ngf-pattern="\'image/*\' "ngf-accept="\'image/*\'">上传</button>' +
        '</div></div>',
        link: function (scope) {
            scope.$watch('entity', function () {
                if (!scope.entity[scope.path] || scope.entity[scope.path].length == 0) {
                    scope.src = typeof scope.portrait == "undefined" ?
                        (typeof scope.square == "undefined" ? "https://file.ceks100.com/group1/M00/00/88/ctes31g7itqAXSX0AAAqjgaTuuE256.png" : "https://file.ceks100.com/group1/M00/00/9D/ctes31hJC_aANGDSAAAW_CS8VpQ101.png" ) :
                        "https://file.ceks100.com/group1/M00/00/64/ctes31fiizWAQMvfAAAXlmlbcnM785.png";
                } else {
                    scope.src = scope.entity[scope.path];
                }
            })
        }
    }
});
entityModule.directive("entityControlFile", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            name: "@entityControlFile",
            title: "@",
            pattern: "@",
            accept: "@",
            size: "@",
            entity: "=",
            validate: "="
        },
        template: '<div class="form-group">' +
        '<label class="col-sm-2 control-label">' +
        '<span ng-bind="title"></span>' +
        '</label>' +
        '<div class="col-sm-6">' +
        '<div ng-show="entity[name] != null"><p>文件名称<span class="m-l" ng-bind="entity[name].name"></span></p><p>文件名大小<span class="m-l" ng-bind="entity[name].size | fmtSize"></span></p></div>' +
        '<button class="btn btn-success center-block" ngf-select ng-model="entity[name]" ngf-pattern="\'*\' "ngf-accept="\'*\'" ngf-max-size="50MB">上传</button>' +
        '</div>' +
        '<p ng-if="isNeedValidate" class="col-xs-4 m-t m-b-0 text-danger" ng-show="inputError()" ng-bind="validate[name].t"></p>' +
        '</div>',
        link: function (scope) {
            scope.$watch('entity.' + scope.name, function () {
                scope.validate[scope.name].v();
            });
            scope.isNeedValidate = typeof scope.validate != "undefined" && typeof scope.validate[scope.name] != "undefined";
            scope.inputFocus = function () {
                if (scope.isNeedValidate) {
                    scope.validate[scope.name].f = true;
                }
            };
            scope.inputBlur = function () {
                if (scope.isNeedValidate) {
                    scope.validate[scope.name].v();
                }
            };
            scope.inputError = function () {
                return !scope.validate[scope.name].p && !scope.validate[scope.name].f;
            }
        }
    }
});
entityModule.directive("entityViewText", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            value: "=entityViewText",
            title: "@",
            icon: "@"
        },
        template: '<div class="m-t row">' +
        '<p class="col-sm-2 text-muted">' +
        '<span class="m-r {{icon}}"></span><span ng-bind="title"></span>' +
        '</p>' +
        '<div class="col-sm-10">' +
        '<p ng-bind="value"></p>' +
        '</div>' +
        '</div>'
    }
});

entityModule.directive("entityViewTextarea", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            value: "=entityViewTextarea",
            title: "@",
            icon: "@"
        },
        template: '<div class="m-t clearfix">' +
        '<p class="text-muted">' +
        '<span class="m-r {{icon}}"></span><span ng-bind="title"></span>' +
        '</p>' +
        '<div class="panel panel-default">' +
        '<div class="panel-body" style="overflow:auto;max-height: 300px;" ng-bind="value"></div>' +
        '</div>' +
        '</div>'
    }
});

entityModule.directive("entityViewImg", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            value: "=entityViewImg",
            title: "@"
        },
        template: '<div class="m-t row">' +
        '<p class="col-sm-2 text-muted">' +
        '<span class="m-r icon-picture"></span><span ng-bind="title"></span>' +
        '</p>' +
        '<div class="col-sm-10">' +
        '<img class="img-rounded img-responsive" ng-src="{{value}}" style="max-height: 200px">' +
        '</div>' +
        '</div>'
    }
});

entityModule.directive("entityViewHtml", function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            value: "=entityViewHtml",
            title: "@",
            icon: "@"
        },
        template: '<div class="m-t clearfix">' +
        '<p class="text-muted">' +
        '<span class="m-r {{icon}}"></span><span ng-bind="title"></span>' +
        '</p>' +
        '<div class="panel panel-default">' +
        '<div class="panel-body" style="overflow:auto;max-height: 300px;" ng-bind-html="value | trustContent"></div>' +
        '</div>' +
        '</div>'
    }
});
