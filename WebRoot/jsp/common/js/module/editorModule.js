/**
 * Created by YTY on 2016/4/4.
 */
var editorModule = angular.module('editorModule', []);
editorModule.directive('editor', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var editor = new wangEditor(element[0]);
            editor.config.mapAk = 'HKEzN9OTlEGTtGzI4m83bUZBWLN56Zu8';
            editor.config.uploadImgUrl = fileHost + '/server/server/upload/uploadImage';
            editor.config.menus = [
                'source',
                '|',
                'bold',
                'underline',
                'italic',
                'strikethrough',
                'eraser',
                'forecolor',
                'bgcolor',
                '|',
                'quote',
                'fontfamily',
                'fontsize',
                'head',
                'unorderlist',
                'orderlist',
                'alignleft',
                'aligncenter',
                'alignright',
                '|',
                'link',
                'unlink',
                'table',
//      'emotion',
                '|',
                'img',
                'video',
                //'location',
                'insertcode',
                '|',
                'undo',
                'redo',
                'fullscreen'
            ];
            if (typeof  attrs.location != "undefined") {
                editor.config.menus.splice(25, 0, 'location');
            }
            editor.onchange = function () {
                // 从 onchange 函数中更新数据
                scope.$apply(function () {
                    var html = editor.$txt.html();
                    ctrl.$setViewValue(html);
                });
            };
            ctrl.$render = function () {
                editor.$txt.html(ctrl.$viewValue);
            };
            editor.create();
        }
    };
});