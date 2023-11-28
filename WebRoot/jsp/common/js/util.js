/**
 * Created by YTY on 2016/4/1.
 */
var deepCopy = function (source, target) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] == null) {
                target[key] = null;
            } else if (typeof source[key] == "object") {
                if (typeof source[key].length == 'number') {
                    target[key] = deepCopy(source[key], []);
                } else if (source[key] instanceof Date) {
                    target[key] = source[key];
                } else {
                    target[key] = deepCopy(source[key], {});
                }
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

var validate = {
    password: {
        v: function (password) {
            return password.match(/^\S{6,20}$/) != null;
        },
        t: "密码为6-20位字符"
    },
    link: {
        v: function (link) {
            return link.length == 0 ||
                (link.match('((http|ftp|https)://)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\&%_\./-~-]*)?') != null);
        },
        t: "请输入以http|ftp|https://开头的合法的URL"
    },
    phone: {
        v: function (phone) {
            return phone.match(/^\d{11}$/) != null;
        },
        t: "手机号为11位数字"
    },
    advisorAccount: {
        v: function (advisorAccount) {
            return advisorAccount.match(/^\d{5}$/) != null;
        },
        t: "顾问账号为5位数字"
    }
}
var getTime = function (time) {
    var s;
    if (time < 60) {
        s = time + "秒";
    } else {
        if (time % 60 > 0) {
            s = time % 60 + "秒";
        } else {
            s = "";
        }
        time = Math.floor(time / 60);
        if (time < 60) {
            s = time + "分钟" + s;
        } else {
            if (time % 60 > 0) {
                s = time % 60 + "分钟" + s;
            }
            time = Math.floor(time / 60);
            s = time + "小时" + s;

        }
    }
    return s;
};
var getSize = function (size) {
    if (size < 1000) {
        return size + "B";
    } else {
        size = size / 1000;
        if (size < 1000) {
            return size.toFixed(2) + "KB";
        }
        else {
            size = size / 1000;
            return size.toFixed(2) + "MB";

        }
    }
};
var getEnumArray = function (e) {
    var es = e.split(",");
    var a = [];
    for (var i in es) {
        a.push({name: es[i], value: i});
    }
    return a;
};

var filterModule = angular.module("filterModule", []);
filterModule.filter('fmtSize', function () {
    return function (size) {
        return getSize(size);
    }
});
filterModule.filter('fmtDuration', function () {
    return function (time) {
        return getTime(time);
    }
});
filterModule.filter('trustContent', function ($sce) {
    return function (content) {
        return $sce.trustAsHtml(content);
    }
});
filterModule.filter('mergerArea', function () {
    return function (mergerArea) {
        return mergerArea ? (mergerArea == "中国" ? mergerArea : mergerArea.replace(/,|中国/g, "")) : "";
    }
});

filterModule.filter('fmtDatetime', function ($filter) {
    return function (time) {
        return time ? $filter('date')(time, 'yyyy年MM月dd日 HH:mm') : "";
    }
});
filterModule.filter('fmtDatetimeWithoutCn', function ($filter) {
    return function (time) {
        return time ? $filter('date')(time, 'yyyy-MM-dd HH:mm') : "";
    }
});
filterModule.filter('fmtDatetimeDetail', function ($filter) {
    return function (time) {
        return time ? $filter('date')(time, 'yyyy-MM-dd HH:mm:ss') : "";
    }
});
filterModule.filter('fmtTime', function ($filter) {
    return function (time) {
        return time ? $filter('date')(time, 'MM月dd日 HH:mm') : "";
    }
});
filterModule.filter('fmtDate', function ($filter) {
    return function (time) {
        return time ? $filter('date')(time, 'yyyy年MM月dd日') : "";
    }
});
filterModule.filter('fmtDateLine', function ($filter) {
    return function (time) {
        return time ? $filter('date')(time, 'yyyy/MM/dd') : "";
    }
});
filterModule.filter('fmtTag', function () {
    return function (value) {
        var tag = eval("(" + value + ")");
        var tags = [];
        for (var i in tag) {
            tags.push(tag[i].name);
        }
        return tags.join(",");
    }
});