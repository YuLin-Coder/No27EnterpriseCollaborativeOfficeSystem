/**
 * 根据d9lab实验室前辈们的经验 总结出一份基础模块类
 * 简化之前繁琐的依赖注入,优化其内部实现代码,并适当扩展其功能
 * --2017 12 17 17:36 zouy
 */
(function (angular) {
    "use strict";

    /**过滤器*/
    angular.module("filterModule", [])
        .filter('to_trusted', ['$sce', function ($sce) {//强制将html字符串转化为html语句
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])
        //ng-bind="time | date : 'yyyy-MM-dd HH:mm'"//直接在绑定时使用filter表达式
        .filter('fmtDateYMdHMcn', function ($filter) {
            return function (time) {
                return time ? $filter('date')(time, 'yyyy年MM月dd日 HH:mm') : "";
            }
        })
        .filter('fmtDateYMDHMsub', function ($filter) {
            return function (time) {
                return time ? $filter('date')(time, 'yyyy-MM-dd HH:mm') : "";
            }
        })
        .filter('fmtDateYMDHMSsub', function ($filter) {
            return function (time) {
                return time ? $filter('date')(time, 'yyyy-MM-dd HH:mm:ss') : "";
            }
        });
    /**ajax请求*/
    angular.module("ajaxModule", [])
        .config(["$httpProvider", function ($httpProvider) {
            // Use x-www-form-urlencoded Content-Type
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $httpProvider.defaults.withCredentials = true;//配合跨域
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null)
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };
            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function (data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];
        }])
        .service("ajax", function ($http) {
            this.ajax = function (url, method, params) {
                var config = {
                    url: url,
                    method: method
                };
                if (method === "GET") {
                    config.params = params;
                } else {
                    config.data = params;
                }
                return $http(config);
            };
        });
    /**表单元素,模态框*/
    angular.module("entityModule", ["angularFileUpload"])
        .service("entity", function () {
            this.getEntity = function (entity, validate, open, submit, modalId, editEntity) {
                var _entity = {
                    entity: entity,
                    validate: validate,
                    submit: submit,
                    modalId: modalId,
                    editEntity: editEntity,//用于编辑
                    modalInitial: true,
                    _openModal: function (row) {
                        open && open(row);
                        _entity.modalInitial = true;
                        //不是编辑模态框就初始化_entity.entity
                        if (_entity.editEntity === null) {
                            $.each(_entity.entity, function (k) {
                                _entity.entity[k] = "";
                            });
                        }
                        //初次打开模态框不触发表单验证
                        $.each(_entity.validate, function (k) {
                            _entity.validate[k].triggle = false;
                        });
                        $("#" + _entity.modalId).modal("show");
                    },
                    _canSubmit: function () {
                        for (var i in _entity.validate) {
                            //这里的canSubmit是在input directive里定义的
                            if (!_entity.validate[i].canSubmit()) {
                                return false;
                            }
                        }
                        return true;
                    },
                    _submit: function () {
                        _entity.submit && _entity.submit();
                    },
                    _success: function () {
                        $("#" + _entity.modalId).modal("hide");
                    },
                    _error: function (message) {
                        alert(message);
                    }
                };
                return _entity;
            };
        })
        .directive("entityModal", function ($timeout) {
            return {
                restrict: 'AE',
                replace: true,
                transclude: {//在html中用E表述
                    "body": "entityModalBody",
                    "footer": "?entityModalFooter"//?表示可选
                },
                scope: {
                    modalId: "@entityModal", title: "@", action: "@",
                    entity: "="
                },
                templateUrl: '/jsp/common/template/modal_template.html',
                link: function (scope) {
                    scope.entity.modalTopAlertShow = false;
                    scope.submit = function () {
                        //点击模态框提交按钮强制触发表单验证
                        scope.entity.modalInitial = false;
                        $.each(scope.entity.validate, function (k) {
                            scope.entity.validate[k].triggle = true;
                        });
                        scope.entity.modalTopAlertShow = !scope.entity._canSubmit();
                        if (scope.entity.modalTopAlertShow) {//表单验证未通过
                            $timeout(function () {
                                scope.entity.modalTopAlertShow = false;
                            }, 1500);
                        } else {//提交表单
                            scope.entity._submit();
                        }
                    };
                    scope.modalBodyClick = function () {
                        //点击modal-body区域(包括表单元素)表示模态框开始使用
                        scope.entity.modalInitial = false;
                    };
                }
            }
        })
        .directive("entityModalView", function () {
            return {
                restrict: 'AE',
                replace: true,
                transclude: {//在html中用E表述
                    "body": "entityModalViewBody",
                    "footer": "?entityModalViewFooter"//?表示可选
                },
                scope: {
                    modalId: "@entityModalView", title: "@", action: "@",
                    entity: "="
                },
                templateUrl: '/jsp/common/template/modal_template.html'
            }
        })
        /*.directive("entityModalImg", function () {
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
         })*/
        .directive("entityEditText", function () {
            /**
             * 一个directive只负责一个输入组件,所以对该输入组件的验证完全可以放在该directive中进行
             * 至于表单的提交,则与directive隔开,单独做判断
             */
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    type: "@", name: "@entityEditText", title: "@",
                    entity: "=", validate: "=vld", e: "=",
                    step: "=", min: "=", max: "="
                },
                template: '<div class="form-group">' +
                '<label class="col-sm-2 col-sm-offset-2 control-label">' +
                '<span ng-if="isNeedValidate" class="icon-asterisk text-danger small" style="margin-right: 6px;"></span>' +
                '<span ng-bind="title"></span>' +
                '</label>' +
                '<div class="col-sm-4">' +
                '<input ng-class="{\'input-error\':inputError() && !e.modalInitial}" class="form-control" name="myForm"' +
                ' type="{{type}}" placeholder="请输入{{title}}" ng-model="entity[name]" ' +
                ' step="{{step}}" min="{{min}}" max="{{max}}" ng-focus="inputFocus()" ng-blur="inputBlur()">' +
                '</div>' +
                '<p ng-if="isNeedValidate" class="col-sm-4 text-danger" style="padding-top: 6px;margin-bottom: 0;">' +
                '<span ng-show="validate[name].triggle && !e.modalInitial">' +
                '<span ng-show="ifEmpty() && type!==\'email\'">{{title}}不能为空</span>' +
                '<span ng-show="type===\'password\' && !ifEmpty() && !ifPassword()">密码长度6到15位</span>' +
                '<span ng-show="type===\'tel\' && !ifEmpty() && !ifTel()">电话应为11位合法数字</span>' +
                '<span ng-show="type===\'email\' && !ifEmail()">邮箱格式不正确</span>' +
                '</span>' +
                '</p>' +
                '</div>',
                link: function (scope) {
                    scope.isNeedValidate = typeof scope.validate !== "undefined" && typeof scope.validate[scope.name] !== "undefined";
                    scope.inputFocus = function () {
                        if (scope.isNeedValidate) {
                            scope.validate[scope.name].triggle = false;
                        }
                    };
                    scope.inputBlur = function () {
                        if (scope.isNeedValidate) {
                            scope.validate[scope.name].triggle = true;
                        }
                    };
                    scope.inputError = function () {
                        if (!scope.isNeedValidate) {
                            return false;
                        }
                        if (!scope.validate[scope.name].triggle) {
                            return false;
                        }
                        if (scope.ifEmpty()) {
                            return true;
                        }

                        switch (scope.type) {
                            case "text":
                                break;
                            case "tel":
                                return !scope.ifTel();
                                break;
                            case "password":
                                return !scope.ifPassword();
                                break;
                            case "email":
                                return !scope.ifEmail();
                                break;
                            case "age":
                                return !scope.ifAge();
                                break;
                        }
                    };
                    scope.ifEmpty = function () {
                        var t = scope.entity[scope.name];
                        return t === null || t === "" || typeof t === "undefined";
                    };
                    scope.ifTel = function () {
                        return /^1[34578]\d{9}$/g.test(scope.entity[scope.name]);
                    };
                    scope.ifAge = function () {
                        return /^(?:[1-9]?\d|100)$/g.test(scope.entity[scope.name]);
                    };
                    scope.ifPassword = function () {
                        return /^\S{6,15}$/g.test(scope.entity[scope.name]);
                    };
                    scope.ifEmail = function () {
                        return /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(scope.entity[scope.name]);
                    };
                    if (scope.isNeedValidate) {//初次不触发验证,并赋值验证函数
                        scope.validate[scope.name].triggle = false;
                        scope.validate[scope.name].canSubmit = function () {
                            return !scope.inputError();
                        };
                    }
                }
            }
        })
        .directive("entityEditTextarea", function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    name: "@entityEditTextarea", title: "@", placeholder: "@",
                    entity: "=", validate: "=vld", e: "="
                },
                template: '<div class="form-group">' +
                '<label class="col-sm-2 col-sm-offset-2 control-label">' +
                '<span ng-if="isNeedValidate" class="icon-asterisk text-danger small" style="margin-right: 6px;"></span>' +
                '<span ng-bind="title"></span>' +
                '</label>' +
                '<div class="col-sm-4">' +
                '<textarea rows="6" class="form-control" placeholder="请输入{{title}}" ng-model="entity[name]"' +
                ' ng-class="{\'input-error\':inputError() && !e.modalInitial}" style="resize: none;"' +
                ' ng-focus="inputFocus()" ng-blur="inputBlur()"></textarea>' +
                '</div>' +
                '<p ng-if="isNeedValidate" class="col-sm-4 text-danger" style="padding-top: 6px;margin-bottom: 0;">' +
                '<span ng-show="validate[name].triggle && !e.modalInitial">' +
                '<span ng-show="ifEmpty()">{{title}}不能为空</span>' +
                '</span>' +
                '</p>' +
                '</div>',
                link: function (scope) {
                    scope.isNeedValidate = typeof scope.validate !== "undefined" && typeof scope.validate[scope.name] !== "undefined";
                    scope.inputFocus = function () {
                        if (scope.isNeedValidate) {
                            scope.validate[scope.name].triggle = false;
                        }
                    };
                    scope.inputBlur = function () {
                        if (scope.isNeedValidate) {
                            scope.validate[scope.name].triggle = true;
                        }
                    };
                    scope.inputError = function () {
                        if (!scope.isNeedValidate) {
                            return false;
                        }
                        if (!scope.validate[scope.name].triggle) {
                            return false;
                        }
                        if (scope.ifEmpty()) {
                            return true;
                        }
                    };
                    scope.ifEmpty = function () {
                        var t = scope.entity[scope.name];
                        return t === null || t === "" || typeof t === "undefined";
                    };
                    if (scope.isNeedValidate) {//初次不触发验证,并赋值验证函数
                        scope.validate[scope.name].triggle = false;
                        scope.validate[scope.name].canSubmit = function () {
                            return !scope.inputError();
                        };
                    }
                }
            }
        })
        .directive("entityRightButton", function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    name: "@entityRightButton", clas: "@",//不能用class,应该是保留字
                    click: "&"
                },
                template: '<div class="form-group">' +
                '<label class="col-sm-2 col-sm-offset-2 control-label">' +
                '</label>' +
                '<div class="col-sm-4">' +
                '<button class="btn form-control btn-default btn-{{clas}}"' +
                ' ng-click="click()">{{name}}</button>' +
                '</div>' +
                '</div>',
                link: function (scope) {

                }
            }
        })
        .directive("entityRightAny", function () {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                scope: {
                    name: "@entityRightAny", title: "@",
                    entity: "=", validate: "=vld", e: "="
                },
                template: '<div class="form-group">' +
                '<label class="col-sm-2 col-sm-offset-2 control-label">' +
                '<span ng-bind="title"></span>' +
                '</label>' +
                '<div class="col-sm-4">' +
                '<ng-transclude></ng-transclude>' +
                '</div>' +
                '</div>',
                link: function (scope) {
                }
            }
        })
        .directive("entityEditImg", function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    name: "@entityEditImg",
                    portrait: "@",
                    path: "@",
                    title: "@",
                    square: "@",
                    entity: "="
                },
                template: '<div class="form-group">' +
                '<label class="col-sm-2 col-sm-offset-2 control-label">' +
                '<span ng-bind="title"></span>' +
                '</label>' +
                '<div class="col-sm-4">' +
                '<img ng-show="entity[name] == null" class="img-responsive img-rounded center-block"' +
                ' ng-src="{{src}}" style="max-height: 200px;">' +

                '</div>' +
                '</div>',
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
        })
        /*.directive('ngFileCustom', function() {
         return {
         restrict: 'E',
         scope: {
         file: '=ngFileCustom'
         },
         link: function(scope, element) {
         element.on('change', function() {
         scope.file = this.files[0];
         console.log(scope.file);
         });
         scope.change = function () {
         console.log("change");
         };
         }
         }
         })*/
        /*.directive("entityControlFile", function () {
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
         })*/
        .directive("entityViewTag", function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    value: "=entityViewTag",
                    title: "@", icon: "@", type: "@"
                },
                template: '<div class="form-group">' +
                '<label class="col-sm-2 col-sm-offset-2 control-label">' +
                '<span ng-bind="title"></span>' +
                '</label>' +
                '<div class="col-sm-5">' +
                '<input type="text" class="form-control"' +
                ' ng-if="type===\'text\'" ng-model="value" disabled style="background-color: white;"/>' +
                '<input type="password" class="form-control"' +
                ' ng-if="type===\'password\'" ng-model="value" disabled style="background-color: white;"/>' +
                '<textarea rows="5" class="form-control" ng-if="type===\'textarea\'" ng-model="value"' +
                ' disabled style="background-color: white;resize: none;"></textarea>' +
                '<img class="img-rounded" src="http://ouq6u283u.bkt.clouddn.com/17-10-24-18:47springfirst.jpg"' +
                ' ng-if="type===\'img\'" style="max-height: 200px" alt="img" />' +
                '<div ng-if="type===\'html\'" class="panel panel-default">' +
                '<div class="panel-body" style="overflow:auto;max-height: 300px;" ng-bind-html="value | trustContent"></div>' +
                '</div>' +
                '</div>' +
                '</div>',
                link: function (scope) {
                    console.log(scope.value);
                }
            }
        });
    /**表格分页*/
    angular.module("pageModule", [])
        .service("page", function () {
            this.page = function (load, orderBy, asc) {
                var page = {
                    sizes: [10, 15, 30, 50],
                    size: 15,
                    jump: 1,
                    hasPrev: false,
                    hasNext: false,
                    current: 1,
                    total: 1,
                    count: 0,
                    orderBy: typeof orderBy == "undefined" ? "" : orderBy,
                    asc: typeof asc == "undefined" ? true : asc,
                    pages: [1],
                    list: [],
                    load: load,
                    refreshPage: function (data) {
                        if (typeof data.page == "undefined") {
                            page.list = data.list;
                            page.hasPrev = false;
                            page.hasNext = false;
                            page.current = 1;
                            page.total = 1;
                            page.count = null;
                            return;
                        }
                        page.list = data.page.list;
                        page.hasPrev = data.page.hasPrev;
                        page.hasNext = data.page.hasNext;
                        page.current = data.page.current;
                        page.total = data.page.total;
                        page.count = data.page.count;
                        page.pages = [];
                        //初始化页码按钮列表
                        for (var i = 1; i <= page.total; i++) {
                            if (i == 1 || i == page.total) {
                                page.pages.push(i);
                            } else if (page.current - i > 4) {
                                i = page.current - 4;
                                page.pages.push("... ");
                            } else if (i - page.current > 3) {
                                i = page.total - 1;
                                page.pages.push(" ...");
                            } else {
                                page.pages.push(i);
                            }
                        }
                    },
                    pushPage: function (data) {
                        if (typeof data.page == "undefined") {
                            page.list = page.list ? page.list.concat(data.list) : data.list;
                            page.hasPrev = false;
                            page.hasNext = false;
                            page.current = 1;
                            page.total = 1;
                            page.count = null;
                            return;
                        }
                        page.list = page.list ? page.list.concat(data.page.list) : data.page.list;
                        page.hasPrev = data.page.hasPrev;
                        page.hasNext = data.page.hasNext;
                        page.current = data.page.current;
                        page.total = data.page.total;
                        page.count = data.page.count;
                        page.pages = [];
                        //初始化页码按钮列表
                        for (var i = 1; i <= page.total; i++) {
                            if (i == 1 || i == page.total) {
                                page.pages.push(i);
                            } else if (page.current - i > 4) {
                                i = page.current - 4;
                                page.pages.push("... ");
                            } else if (i - page.current > 3) {
                                i = page.total - 1;
                                page.pages.push(" ...");
                            } else {
                                page.pages.push(i);
                            }
                        }
                    },
                    orderTo: function (orderBy) {
                        if (typeof orderBy == "undefined" || orderBy.length == 0) {
                            return;
                        }
                        if (orderBy == page.orderBy) {
                            page.asc = !page.asc;
                        } else {
                            page.asc = true;
                            page.orderBy = orderBy;
                        }
                        page.load(page.current, page.size, page.orderBy, page.asc);
                    },
                    clear: function () {
                        page.list.length = 0
                    },
                    prev: function () {
                        if (page.current > 1) {
                            page.load(page.current - 1, page.size, page.orderBy, page.asc);
                        }
                    },
                    next: function () {
                        if (page.current < page.total) {
                            page.load(page.current + 1, page.size, page.orderBy, page.asc);
                        }
                    },
                    pageTo: function (current) {
                        if (!isNaN(current) && current != page.current) {
                            page.load(current, page.size, page.orderBy, page.asc);
                        }
                    },
                    refresh: function () {
                        page.load(page.current, page.size, page.orderBy, page.asc);
                    },
                    refreshTo: function (current) {
                        page.load(current, page.size, page.orderBy, page.asc);
                    }
                };
                page.refreshPage({
                    page: {
                        hasPrev: false,
                        hasNext: false,
                        current: 1,
                        total: 1,
                        count: 0
                    }
                }, page.orderBy, page.asc);
                return page;
            };
        });
    /**省市区*/
    angular.module("areaModule", ["ajaxModule"])
        .service("area", function (ajax) {
            this.getArea = function (onSelect, areaCode) {
                var url = "/server/area/getByParentCode";
                var method = "POST";
                var initAreaCode = typeof areaCode == "undefined" || areaCode == 100000 ? null : areaCode;
                var defaultArea = {code: 100000, lng: 116.3683244, lat: 39.915085, level: 0};
                var area = {
                    area: defaultArea,
                    provinces: [],
                    province: null,
                    cities: [],
                    city: null,
                    districts: [],
                    district: null,
                    onSelect: onSelect,
                    reset: function (areaCode) {
                        initAreaCode = typeof areaCode == "undefined" ? null : areaCode;
                        area.getProvinces(true);
                    },
                    getProvinces: function (isInit) {
                        area.area = defaultArea;
                        area.citys = [];
                        area.city = null;
                        area.districts = [];
                        area.district = null;
                        ajax.ajax(url, method, {
                            userId: userId,
                            parentCode: area.area.code,
                            level: area.area.level + 1
                        }).success(function (data) {
                            area.provinces = data.list;
                            if (initAreaCode) {
                                for (var i in area.provinces) {
                                    var p = area.provinces[i];
                                    if (initAreaCode >= p.code && initAreaCode - p.code < 10000) {
                                        area.province = p;
                                        area.getCities(isInit)
                                        if (initAreaCode == p.code) {
                                            initAreaCode = null;
                                        }
                                    }
                                }
                            }
                        });
                    },
                    getCities: function (isInit) {
                        area.area = area.province == null ? defaultArea : area.province;
                        area.citys = [];
                        area.city = null;
                        area.districts = [];
                        area.district = null;
                        area.onSelect(area.area, isInit);
                        if (!area.province) {
                            return;
                        }
                        ajax.ajax(url, method, {
                            userId: userId,
                            parentCode: area.area.code,
                            level: area.area.level + 1
                        }).success(function (data) {
                            area.cities = data.list;
                            if (initAreaCode) {
                                for (var i in area.cities) {
                                    var p = area.cities[i];
                                    if (initAreaCode >= p.code && initAreaCode - p.code < 100) {
                                        area.city = p;
                                        area.getDistricts(isInit)
                                        if (initAreaCode == p.code) {
                                            initAreaCode = null;
                                        }
                                    }
                                }
                            }
                        });
                    },
                    getDistricts: function (isInit) {
                        area.area = area.city == null ? area.province : area.city;
                        area.districts = [];
                        area.district = null;
                        area.onSelect(area.area, isInit);
                        if (!area.city) {
                            return;
                        }
                        ajax.ajax(url, method, {
                            userId: userId,
                            parentCode: area.area.code,
                            level: area.area.level + 1
                        }).success(function (data) {
                            area.districts = data.list;
                            if (initAreaCode) {
                                for (var i in area.districts) {
                                    var p = area.districts[i];
                                    if (initAreaCode >= p.code && initAreaCode - p.code < 1) {
                                        area.district = p;
                                        area.selectDistrict(isInit);
                                        if (initAreaCode == p.code) {
                                            initAreaCode = null;
                                        }
                                    }
                                }
                            }
                        });
                    },
                    selectDistrict: function (isInit) {
                        area.area = area.district == null ? area.city : area.district;
                        area.onSelect(area.area, isInit);
                    }
                };
                area.getProvinces(true);
                return area;
            }
        })
        .directive("area", function (area) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    change: "&",
                    service: "&"
                },
                template: '<span><label>省<select class="form-control m-l" ng-model="area.province" ng-change="area.getCities()"ng-options="a as a.name for a in area.provinces"><option value="">请选择</option></select></label>' +
                '<label class="m-l-md">市<select class="form-control m-l" ng-model="area.city" ng-change="area.getDistricts()"ng-options="a as a.name for a in area.cities"><option value="">请选择</option></select></label>' +
                '<label class="m-l-md">区<select class="form-control m-l" ng-model="area.district" ng-change="area.selectDistrict()"ng-options="a as a.name for a in area.districts"><option value="">请选择</option></select></label></span>',
                link: function (scope) {
                    scope.area = area.getArea(function (area, isInit) {
                        scope.change({$area: area, $isInit: isInit});
                        console.info("change(area:" + area + ",  isInit:" + isInit + ")");
                    });
                    scope.service({$area: scope.area});
                }
            }
        });
    /**高德地图*/
    angular.module("mapModule", [])
        .directive("map", function () {
            return {
                restrict: 'A',
                scope: {
                    service: "&",
                    change: "&"
                },
                link: function (scope, element, attr) {
                    var defaultPoint = [116.404, 39.915];
                    var level = 6;
                    var map = new AMap.Map(attr['id'], {
                        zoom: level,
                        center: defaultPoint
                    });
                    AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                        var toolBar = new AMap.ToolBar();
                        var scale = new AMap.Scale();
                        map.addControl(toolBar);
                        map.addControl(scale);
                    });
                    var marker = new AMap.Marker({
                        position: defaultPoint,
                        animation: 'AMAP_ANIMATION_BOUNCE',
                        map: map
                    });
                    map.on('click', function (e) {
                        var point = [e.lnglat.lng, e.lnglat.lat];
                        marker.setPosition(point);
                        scope.change({
                            $lng: point[0],
                            $lat: point[1]
                        })
                    });
                    scope.service({
                        $map: {
                            change: function (lng, lat, level) {
                                var point = lng && lat ? [lng, lat] : defaultPoint;
                                var level = level == 0 ? 6 : (level == 1 ? 8 : (level == 2 ? 12 : 14));
                                marker.setPosition(point);
                                map.setZoomAndCenter(level, point);
                            }
                        }
                    });
                }
            }
        });

    /**将以上module汇总为baseModule,应尽量减少重复注入
     * filterModule
     * entityModule <- angularFileUpload
     * ajaxModule
     * pageModule
     * areaModule <- ajaxModule
     * mapModule
     */
    angular.module("baseModule",["filterModule","entityModule"/*,"ajaxModule"*/,"pageModule","areaModule",
        "mapModule"]);
})(angular);
