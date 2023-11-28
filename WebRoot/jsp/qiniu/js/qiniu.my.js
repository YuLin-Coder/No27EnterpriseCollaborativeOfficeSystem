/**
 * Created by zouy on 18-1-29.
 */
angular.module("qiniu", [])
    .service("uploader", function () {
        this.getUploader = function ($scope, obj, forward) {
            obj = $.extend({"pickfiles":"pickfiles","container":"container"},obj);
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: obj.pickfiles,//'pickfiles',         // 上传选择的点选按钮，必需
                multi_selection: false,  // 禁用多选,但是重复单选也会选择多个文件(官方没处理好),
                log_level: 1,
                /*uptoken : 'q4na_153VieL4zqMbr27YsAi2g7zqW2fhicHqJ8J:kVvfdpDDntnSE5n0einCDCNZOGI=' +
                 ':eyJzY29wZSI6InRvbWFzeWFvLXBpY2JlZCIsImRlYWRsaW5lIjoxNTE5NjI5Mzg5fQ==', */// uptoken是上传凭证，由其他程序生成
                uptoken_url: '/qiniu/upToken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                /*uptoken_func: function(e){    // 在需要获取uptoken时，该方法会被调用
                 // do something
                 //return uptoken;
                 },*/
                get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了save_key，则开启，SDK在前端将不对key进行任何处理
                domain: 'http://p6aepqonl.bkt.clouddn.com/',     // bucket域名，下载资源时用到，必需
                container: obj.container,//'container',             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '10mb',             // 最大文件体积限制
                //flash_swf_url: '/jsp/qiniu/js/Moxie.swf',  //引入flash，相对路径
                max_retries: 3,                     // 上传失败最大重试次数
                //dragdrop: true,                     // 开启可拖曳上传
                //drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: false,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                //x_vars : {
                //    查看自定义变量
                //    'time' : function(up,file) {
                //        var time = (new Date()).getTime();
                // do something with 'time'
                //        return time;
                //    },
                //    'size' : function(up,file) {
                //        var size = file.size;
                // do something with 'size'
                //        return size;
                //    }
                //},
                init: {
                    'FilesAdded': function (up, files) {
                        $scope.$apply(function () {
                            $scope.qnNgObj.status.changeStatus(false, true, false);
                        });
                        console.log(files);
                        plupload.each(files, function (file) {
                            // 文件添加进队列后，处理相关的事情
                            //console.log(file.getNative());//拿到原生文件对象
                            var fileItem = file.getNative(),
                                url = window.URL || window.webkitURL || window.mozURL;
                            var src = url.createObjectURL(fileItem);
                            $("#imgPrev").attr("src", src);
                            //单文件上传
                            if (up.files.length > 1) {
                                up.files.splice(0, 1);//只保留最后选择的那个文件
                            }
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前，处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时，处理相关的事情
                    },
                    'FileUploaded': function (up, file, info) {
                        // 每个文件上传成功后，处理相关的事情
                        // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 查看简单反馈
                        var domain = up.getOption('domain');
                        var res = JSON.parse(info.response);
                        if (info.status == 200) {//如果上传成功
                            $scope.$apply(function () {
                                $scope.qnNgObj.status.changeStatus(false, true, true);
                            });

                            var sourceLink = domain + "/" + res.key; //获取上传成功后的文件的Url
                            console.log("上传成功: " + sourceLink);
                            forward && forward(sourceLink);
                        }
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时，处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后，处理相关的事情
                    },
                    'Key': function (up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在unique_names: false，save_key: false时才生效

                        var key = "";
                        // do something with key here
                        return key;
                    }
                }
            });
            return uploader;
        };
    });