/**
 * Created by YTY on 2016/3/26.
 */
var areaModule = angular.module("areaModule", ["ajaxModule"]);
areaModule.service("area", function (ajax) {
    return {
        getArea: function (onSelect, areaCode) {
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
    }
});
areaModule.directive("area", function (area) {
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
})