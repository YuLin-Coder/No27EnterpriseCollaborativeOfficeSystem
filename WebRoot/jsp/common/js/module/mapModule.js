/**
 * Created by YTY on 2016/11/9.
 */
var mapModule = angular.module('mapModule', []);
mapModule.directive('map', function () {
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