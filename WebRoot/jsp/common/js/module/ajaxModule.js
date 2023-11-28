/**
 * Created by YTY on 2015/12/8.
 */
var ajaxModule = angular.module("ajaxModule", [], function ($httpProvider) {
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
});
//使用方式：
//ajaxRepeat.ajax(url, method, params, index).zjsSuccess(function(data, index){
//  your code here
//});
ajaxModule.service("ajaxList", function ($http) {
    return {
        ajax: function (url, method, params, index) {
            var config = {
                url: url,
                method: method
            };
            if (method == "GET") {
                config.params = params;
            } else {
                config.data = params;
            }
            var service = {
                service: $http(config),
                success: function (handler) {
                    service.service.success(function (data) {
                        handler(data, index);
                    });
                    return service;
                },
                error: function (handler) {
                    service.service.error(function () {
                        handler(index);
                    });
                    return service;
                }
            };
            return service;
        }
    }
});
//使用方式：
//ajax.ajax(url, method, params, index).success(function(data, index){
//  your code here
//});
ajaxModule.service("ajax", function ($http) {
    return {
        ajax: function (url, method, params) {
            var config = {
                url: url,
                method: method
            };
            if (method == "GET") {
                config.params = params;
            } else {
                config.data = params;
            }
            return $http(config);
        }
    }
});