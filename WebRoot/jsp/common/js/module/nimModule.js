angular.module("nimModule", [])
    .service("nimService", function () {
        return {
            getNimInstance: function () {
                var p = {accid: "tomasyao", token: "768ca2cf81c2f93026f7c18c49ba4729"};
                var nim = {};
                var configObj = {
                    appKey: "2f13970222140958538c4246bd8dbee8",
                    account: p.accid,
                    token: p.token,
                    onconnect: function () {
                        console.log('登录成功');
                    },
                    onwillreconnect: function (obj) {
                        console.log('即将重连');
                        console.log(obj.retryCount);
                        console.log(obj.duration);
                    },
                    ondisconnect: function (error) {
                        console.log('丢失连接');
                        console.log(error);
                    },
                    onerror: function (error) {
                        console.log(error);
                    }
                };
                /**连接相关**/
                nim.connection = {
                    init: function () {
                        return NIM.getInstance(configObj);
                    }
                };
                /**图片处理**/
                nim.img = {
                    //获取本地文件
                    getInputFile: function (id, callback) {
                        //获取文件
                        var file = document.getElementById(id).files[0];
                        if (file === undefined) {
                            return;
                        }
                        //创建读取文件的对象
                        var reader = new FileReader();
                        //创建文件读取相关的变量
                        var imgFile;
                        //为文件读取成功设置事件
                        reader.onload = function (e) {
                            console.log('文件读取完成');
                            imgFile = e.target.result;//base64
                            //console.log(e.target);
                            nim.img.compress(imgFile, {quality: 0.7}, callback);
                        };
                        //正式读取文件
                        reader.readAsDataURL(file);
                    },
                    //压缩本地图片
                    compress: function (path, obj, callback) {
                        var img = new Image();
                        img.onload = function () {
                            var that = this;
                            // 默认按比例压缩
                            var w = that.width,
                                h = that.height,
                                scale = w / h;
                            w = obj.width || w;
                            h = obj.height || (w / scale);
                            var quality = 0.7;  // 默认图片质量为0.7
                            //生成canvas
                            var canvas = document.createElement('canvas');
                            var ctx = canvas.getContext('2d');
                            // 创建属性节点
                            var anw = document.createAttribute("width");
                            anw.nodeValue = w;
                            var anh = document.createAttribute("height");
                            anh.nodeValue = h;
                            canvas.setAttributeNode(anw);
                            canvas.setAttributeNode(anh);
                            ctx.drawImage(that, 0, 0, w, h);
                            // 图像质量
                            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                                quality = obj.quality;
                            }
                            // quality值越小，所绘制出的图像越模糊
                            var base64 = canvas.toDataURL('image/jpeg', quality);
                            // 回调函数返回base64的值
                            callback(base64);
                        };
                        img.src = path;
                    },
                    //上传文件
                    upload: function (nim, dataURL, callback) {
                        nim.previewFile({
                            type: 'image',
                            dataURL: dataURL,
                            uploadprogress: function (obj) {
                            },
                            done: function (error, file) {
                                if (!error) {
                                    callback(file);
                                } else {
                                    alert("图片上传失败,请检查网络设置!");
                                }
                            }
                        });
                    },
                    //点击全屏显示图片
                    fullScreen: function (url) {
                        //目标全屏元素
                        var target = $(".popup");
                        //如果存在,直接赋值并显示
                        if (target.length !== 0) {
                            target.children().children().attr("src", url);
                            target.css("display", "block");
                            return;
                        }
                        //如果不存在,即为第一次加载,生成DOM元素即可
                        var div = $(".fullScreen");
                        var t = $('<div class="popup"><div class="popup-bg"><img alt=""/></div></div>');
                        div.append(t);//添加到html文档中
                        div.children().children().children().attr("src", url);
                        div.click(function () {
                            $(".popup").css("display", "none");
                        });
                        div.children().css("display", "block");
                    },
                    //动态设置图片宽高
                    dynamicWH: function (imgSrc, platform) {
                        var value = platform == "phone" ? 150 : 280;
                        var img = new Image();
                        img.src = imgSrc;

                        var obj = {};
                        if (img.width == img.height) {
                            obj.width = obj.height = value;
                        } else if (img.width > img.height) {
                            obj.width = value;
                        } else {
                            obj.height = value;
                        }

                        return obj;
                    }
                };
                /**其它操作**/
                nim.operation = {
                    //播放新消息提示音
                    playHintTone: function (str) {
                        var url = "/jsp/webIm/asset/mp3/" + str;
                        if (document.getElementById("playHintToneId")) {
                            document.getElementById("playHintToneId").play();
                            return;
                        }
                        var audio = document.createElement('audio');
                        audio.id = "playHintToneId";

                        var source = document.createElement('source');
                        source.type = "audio/mpeg";
                        source.src = url;
                        source.autoplay = "autoplay";
                        source.controls = "controls";

                        audio.appendChild(source);
                        audio.play();
                    },
                    //语音消息播放
                    playAudioMsg: function (url, $event) {
                        //获取被点击的p标签 或 img标签
                        var caEle = $($event.target),
                            caTag = caEle[0].tagName;
                        if (caTag === "P") {
                            caEle.children().attr("src", "/jsp/webIm/asset/loading/radio.gif");
                        } else if (caTag === "IMG") {
                            caEle.attr("src", "/jsp/webIm/asset/loading/radio.gif");
                        }

                        if (document.getElementById("playAudioMsgId")) {
                            document.getElementById("playAudioMsgId").play();
                            return;
                        }
                        var audio = document.createElement('audio');
                        audio.id = "playAudioMsgId";
                        //音频播放完成回调
                        audio.onended = function () {
                            if (caTag === "P") {
                                caEle.children().attr("src", "/jsp/webIm/asset/loading/radio.png");
                            } else if (caTag === "IMG") {
                                caEle.attr("src", "/jsp/webIm/asset/loading/radio.png");
                            }
                        };

                        var source = document.createElement('source');
                        source.type = "audio/mpeg";
                        source.src = url;
                        source.autoplay = "autoplay";
                        source.controls = "controls";

                        audio.appendChild(source);
                        audio.play();
                    }
                };
                /**表情**/
                nim.emoji = {
                    emojiList: {
                        "emoji": [
                            {"code": "[大笑]", "img": "emoji_0.png"}, {
                                "code": "[可爱]",
                                "img": "emoji_01.png"
                            }, {"code": "[色]", "img": "emoji_02.png"},
                            {"code": "[嘘]", "img": "emoji_03.png"}, {
                                "code": "[亲]",
                                "img": "emoji_04.png"
                            }, {"code": "[呆]", "img": "emoji_05.png"},
                            {"code": "[口水]", "img": "emoji_06.png"}, {
                                "code": "[汗]",
                                "img": "emoji_145.png"
                            }, {"code": "[呲牙]", "img": "emoji_07.png"},
                            {"code": "[鬼脸]", "img": "emoji_08.png"}, {
                                "code": "[害羞]",
                                "img": "emoji_09.png"
                            }, {"code": "[偷笑]", "img": "emoji_10.png"},
                            {"code": "[调皮]", "img": "emoji_11.png"}, {
                                "code": "[可怜]",
                                "img": "emoji_12.png"
                            }, {"code": "[敲]", "img": "emoji_13.png"},
                            {"code": "[惊讶]", "img": "emoji_14.png"}, {
                                "code": "[流感]",
                                "img": "emoji_15.png"
                            }, {"code": "[委屈]", "img": "emoji_16.png"},
                            {"code": "[流泪]", "img": "emoji_17.png"}, {
                                "code": "[嚎哭]",
                                "img": "emoji_18.png"
                            }, {"code": "[惊恐]", "img": "emoji_19.png"},
                            {"code": "[怒]", "img": "emoji_20.png"}, {
                                "code": "[酷]",
                                "img": "emoji_21.png"
                            }, {"code": "[不说]", "img": "emoji_22.png"},
                            {"code": "[鄙视]", "img": "emoji_23.png"}, {
                                "code": "[阿弥陀佛]",
                                "img": "emoji_24.png"
                            }, {"code": "[奸笑]", "img": "emoji_25.png"},
                            {"code": "[睡着]", "img": "emoji_26.png"}, {
                                "code": "[口罩]",
                                "img": "emoji_27.png"
                            }, {"code": "[努力]", "img": "emoji_28.png"},
                            {"code": "[抠鼻孔]", "img": "emoji_29.png"}, {
                                "code": "[疑问]",
                                "img": "emoji_30.png"
                            }, {"code": "[怒骂]", "img": "emoji_31.png"},
                            {"code": "[晕]", "img": "emoji_32.png"}, {
                                "code": "[呕吐]",
                                "img": "emoji_33.png"
                            }, {"code": "[拜一拜]", "img": "emoji_160.png"},
                            {"code": "[惊喜]", "img": "emoji_161.png"}, {
                                "code": "[流汗]",
                                "img": "emoji_162.png"
                            }, {"code": "[卖萌]", "img": "emoji_163.png"},
                            {"code": "[默契眨眼]", "img": "emoji_164.png"}, {
                                "code": "[烧香拜佛]",
                                "img": "emoji_165.png"
                            }, {"code": "[晚安]", "img": "emoji_166.png"},
                            {"code": "[强]", "img": "emoji_34.png"}, {
                                "code": "[弱]",
                                "img": "emoji_35.png"
                            }, {"code": "[OK]", "img": "emoji_36.png"},
                            {"code": "[拳头]", "img": "emoji_37.png"}, {
                                "code": "[胜利]",
                                "img": "emoji_38.png"
                            }, {"code": "[鼓掌]", "img": "emoji_39.png"},
                            {"code": "[握手]", "img": "emoji_200.png"}, {
                                "code": "[发怒]",
                                "img": "emoji_40.png"
                            }, {"code": "[骷髅]", "img": "emoji_41.png"},
                            {"code": "[便便]", "img": "emoji_42.png"}, {
                                "code": "[火]",
                                "img": "emoji_43.png"
                            }, {"code": "[溜]", "img": "emoji_44.png"},
                            {"code": "[爱心]", "img": "emoji_45.png"}, {
                                "code": "[心碎]",
                                "img": "emoji_46.png"
                            }, {"code": "[钟情]", "img": "emoji_47.png"},
                            {"code": "[唇]", "img": "emoji_48.png"}, {
                                "code": "[戒指]",
                                "img": "emoji_49.png"
                            }, {"code": "[钻石]", "img": "emoji_50.png"},
                            {"code": "[太阳]", "img": "emoji_51.png"}, {
                                "code": "[有时晴]",
                                "img": "emoji_52.png"
                            }, {"code": "[多云]", "img": "emoji_53.png"},
                            {"code": "[雷]", "img": "emoji_54.png"}, {
                                "code": "[雨]",
                                "img": "emoji_55.png"
                            }, {"code": "[雪花]", "img": "emoji_56.png"},
                            {"code": "[爱人]", "img": "emoji_57.png"}, {
                                "code": "[帽子]",
                                "img": "emoji_58.png"
                            }, {"code": "[皇冠]", "img": "emoji_59.png"},
                            {"code": "[篮球]", "img": "emoji_60.png"}, {
                                "code": "[足球]",
                                "img": "emoji_61.png"
                            }, {"code": "[垒球]", "img": "emoji_62.png"},
                            {"code": "[网球]", "img": "emoji_63.png"}, {
                                "code": "[台球]",
                                "img": "emoji_64.png"
                            }, {"code": "[咖啡]", "img": "emoji_65.png"},
                            {"code": "[啤酒]", "img": "emoji_66.png"}, {
                                "code": "[干杯]",
                                "img": "emoji_67.png"
                            }, {"code": "[柠檬汁]", "img": "emoji_68.png"},
                            {"code": "[餐具]", "img": "emoji_69.png"}, {
                                "code": "[汉堡]",
                                "img": "emoji_70.png"
                            }, {"code": "[鸡腿]", "img": "emoji_71.png"},
                            {"code": "[面条]", "img": "emoji_72.png"}, {
                                "code": "[冰淇淋]",
                                "img": "emoji_73.png"
                            }, {"code": "[沙冰]", "img": "emoji_74.png"},
                            {"code": "[生日蛋糕]", "img": "emoji_75.png"}, {
                                "code": "[蛋糕]",
                                "img": "emoji_76.png"
                            }, {"code": "[糖果]", "img": "emoji_77.png"},
                            {"code": "[葡萄]", "img": "emoji_78.png"}, {
                                "code": "[西瓜]",
                                "img": "emoji_79.png"
                            }, {"code": "[光碟]", "img": "emoji_80.png"},
                            {"code": "[手机]", "img": "emoji_81.png"}, {
                                "code": "[电话]",
                                "img": "emoji_82.png"
                            }, {"code": "[电视]", "img": "emoji_83.png"},
                            {"code": "[声音开启]", "img": "emoji_84.png"}, {
                                "code": "[声音关闭]",
                                "img": "emoji_85.png"
                            }, {"code": "[铃铛]", "img": "emoji_86.png"},
                            {"code": "[锁头]", "img": "emoji_87.png"}, {
                                "code": "[放大镜]",
                                "img": "emoji_88.png"
                            }, {"code": "[灯泡]", "img": "emoji_89.png"},
                            {"code": "[锤头]", "img": "emoji_90.png"}, {
                                "code": "[烟]",
                                "img": "emoji_91.png"
                            }, {"code": "[炸弹]", "img": "emoji_92.png"},
                            {"code": "[枪]", "img": "emoji_93.png"}, {
                                "code": "[刀]",
                                "img": "emoji_94.png"
                            }, {"code": "[药]", "img": "emoji_95.png"},
                            {"code": "[打针]", "img": "emoji_96.png"}, {
                                "code": "[钱袋]",
                                "img": "emoji_97.png"
                            }, {"code": "[钞票]", "img": "emoji_98.png"},
                            {"code": "[银行卡]", "img": "emoji_99.png"}, {
                                "code": "[手柄]",
                                "img": "emoji_100.png"
                            }, {"code": "[麻将]", "img": "emoji_101.png"},
                            {"code": "[调色板]", "img": "emoji_102.png"}, {
                                "code": "[电影]",
                                "img": "emoji_103.png"
                            }, {"code": "[麦克风]", "img": "emoji_104.png"},
                            {"code": "[耳机]", "img": "emoji_105.png"}, {
                                "code": "[音乐]",
                                "img": "emoji_106.png"
                            }, {"code": "[吉他]", "img": "emoji_107.png"},
                            {"code": "[火箭]", "img": "emoji_108.png"}, {
                                "code": "[飞机]",
                                "img": "emoji_109.png"
                            }, {"code": "[火车]", "img": "emoji_110.png"},
                            {"code": "[公交]", "img": "emoji_111.png"}, {
                                "code": "[轿车]",
                                "img": "emoji_112.png"
                            }, {"code": "[出租车]", "img": "emoji_113.png"},
                            {"code": "[警车]", "img": "emoji_114.png"}, {"code": "[自行车]", "img": "emoji_115.png"}
                        ]
                    },
                    //用于解析
                    emojiMap: {
                        "[大笑]": {file: "emoji_0.png"},
                        "[可爱]": {file: "emoji_01.png"},
                        "[色]": {file: "emoji_02.png"},
                        "[嘘]": {file: "emoji_03.png"},
                        "[亲]": {file: "emoji_04.png"},
                        "[呆]": {file: "emoji_05.png"},
                        "[口水]": {file: "emoji_06.png"},
                        "[汗]": {file: "emoji_145.png"},
                        "[呲牙]": {file: "emoji_07.png"},
                        "[鬼脸]": {file: "emoji_08.png"},
                        "[害羞]": {file: "emoji_09.png"},
                        "[偷笑]": {file: "emoji_10.png"},
                        "[调皮]": {file: "emoji_11.png"},
                        "[可怜]": {file: "emoji_12.png"},
                        "[敲]": {file: "emoji_13.png"},
                        "[惊讶]": {file: "emoji_14.png"},
                        "[流感]": {file: "emoji_15.png"},
                        "[委屈]": {file: "emoji_16.png"},
                        "[流泪]": {file: "emoji_17.png"},
                        "[嚎哭]": {file: "emoji_18.png"},
                        "[惊恐]": {file: "emoji_19.png"},
                        "[怒]": {file: "emoji_20.png"},
                        "[酷]": {file: "emoji_21.png"},
                        "[不说]": {file: "emoji_22.png"},
                        "[鄙视]": {file: "emoji_23.png"},
                        "[阿弥陀佛]": {file: "emoji_24.png"},
                        "[奸笑]": {file: "emoji_25.png"},
                        "[睡着]": {file: "emoji_26.png"},
                        "[口罩]": {file: "emoji_27.png"},
                        "[努力]": {file: "emoji_28.png"},
                        "[抠鼻孔]": {file: "emoji_29.png"},
                        "[疑问]": {file: "emoji_30.png"},
                        "[怒骂]": {file: "emoji_31.png"},
                        "[晕]": {file: "emoji_32.png"},
                        "[呕吐]": {file: "emoji_33.png"},
                        "[拜一拜]": {file: "emoji_160.png"},
                        "[惊喜]": {file: "emoji_161.png"},
                        "[流汗]": {file: "emoji_162.png"},
                        "[卖萌]": {file: "emoji_163.png"},
                        "[默契眨眼]": {file: "emoji_164.png"},
                        "[烧香拜佛]": {file: "emoji_165.png"},
                        "[晚安]": {file: "emoji_166.png"},
                        "[强]": {file: "emoji_34.png"},
                        "[弱]": {file: "emoji_35.png"},
                        "[OK]": {file: "emoji_36.png"},
                        "[拳头]": {file: "emoji_37.png"},
                        "[胜利]": {file: "emoji_38.png"},
                        "[鼓掌]": {file: "emoji_39.png"},
                        "[握手]": {file: "emoji_200.png"},
                        "[发怒]": {file: "emoji_40.png"},
                        "[骷髅]": {file: "emoji_41.png"},
                        "[便便]": {file: "emoji_42.png"},
                        "[火]": {file: "emoji_43.png"},
                        "[溜]": {file: "emoji_44.png"},
                        "[爱心]": {file: "emoji_45.png"},
                        "[心碎]": {file: "emoji_46.png"},
                        "[钟情]": {file: "emoji_47.png"},
                        "[唇]": {file: "emoji_48.png"},
                        "[戒指]": {file: "emoji_49.png"},
                        "[钻石]": {file: "emoji_50.png"},
                        "[太阳]": {file: "emoji_51.png"},
                        "[有时晴]": {file: "emoji_52.png"},
                        "[多云]": {file: "emoji_53.png"},
                        "[雷]": {file: "emoji_54.png"},
                        "[雨]": {file: "emoji_55.png"},
                        "[雪花]": {file: "emoji_56.png"},
                        "[爱人]": {file: "emoji_57.png"},
                        "[帽子]": {file: "emoji_58.png"},
                        "[皇冠]": {file: "emoji_59.png"},
                        "[篮球]": {file: "emoji_60.png"},
                        "[足球]": {file: "emoji_61.png"},
                        "[垒球]": {file: "emoji_62.png"},
                        "[网球]": {file: "emoji_63.png"},
                        "[台球]": {file: "emoji_64.png"},
                        "[咖啡]": {file: "emoji_65.png"},
                        "[啤酒]": {file: "emoji_66.png"},
                        "[干杯]": {file: "emoji_67.png"},
                        "[柠檬汁]": {file: "emoji_68.png"},
                        "[餐具]": {file: "emoji_69.png"},
                        "[汉堡]": {file: "emoji_70.png"},
                        "[鸡腿]": {file: "emoji_71.png"},
                        "[面条]": {file: "emoji_72.png"},
                        "[冰淇淋]": {file: "emoji_73.png"},
                        "[沙冰]": {file: "emoji_74.png"},
                        "[生日蛋糕]": {file: "emoji_75.png"},
                        "[蛋糕]": {file: "emoji_76.png"},
                        "[糖果]": {file: "emoji_77.png"},
                        "[葡萄]": {file: "emoji_78.png"},
                        "[西瓜]": {file: "emoji_79.png"},
                        "[光碟]": {file: "emoji_80.png"},
                        "[手机]": {file: "emoji_81.png"},
                        "[电话]": {file: "emoji_82.png"},
                        "[电视]": {file: "emoji_83.png"},
                        "[声音开启]": {file: "emoji_84.png"},
                        "[声音关闭]": {file: "emoji_85.png"},
                        "[铃铛]": {file: "emoji_86.png"},
                        "[锁头]": {file: "emoji_87.png"},
                        "[放大镜]": {file: "emoji_88.png"},
                        "[灯泡]": {file: "emoji_89.png"},
                        "[锤头]": {file: "emoji_90.png"},
                        "[烟]": {file: "emoji_91.png"},
                        "[炸弹]": {file: "emoji_92.png"},
                        "[枪]": {file: "emoji_93.png"},
                        "[刀]": {file: "emoji_94.png"},
                        "[药]": {file: "emoji_95.png"},
                        "[打针]": {file: "emoji_96.png"},
                        "[钱袋]": {file: "emoji_97.png"},
                        "[钞票]": {file: "emoji_98.png"},
                        "[银行卡]": {file: "emoji_99.png"},
                        "[手柄]": {file: "emoji_100.png"},
                        "[麻将]": {file: "emoji_101.png"},
                        "[调色板]": {file: "emoji_102.png"},
                        "[电影]": {file: "emoji_103.png"},
                        "[麦克风]": {file: "emoji_104.png"},
                        "[耳机]": {file: "emoji_105.png"},
                        "[音乐]": {file: "emoji_106.png"},
                        "[吉他]": {file: "emoji_107.png"},
                        "[火箭]": {file: "emoji_108.png"},
                        "[飞机]": {file: "emoji_109.png"},
                        "[火车]": {file: "emoji_110.png"},
                        "[公交]": {file: "emoji_111.png"},
                        "[轿车]": {file: "emoji_112.png"},
                        "[出租车]": {file: "emoji_113.png"},
                        "[警车]": {file: "emoji_114.png"},
                        "[自行车]": {file: "emoji_115.png"}
                    },
                    //将文本消息转化为html字符串
                    transferToHtml: function (text) {
                        var re = /\[([^\]\[]*)\]/g;
                        var matches = text.match(re) || [];
                        for (var j = 0, len = matches.length; j < len; ++j) {
                            if (this.emojiMap[matches[j]]) {
                                text = text.replace(matches[j],
                                    '<img class="emoji" src="/jsp/webIm/asset/emoji/' + this.emojiMap[matches[j]].file + '"' +
                                    ' width="32" height="32" />');
                            }
                        }
                        return text;
                    }
                };

                return nim;
            }
        }
    });
