/**
 * Created by YTY on 2015/10/10.
 */
//分页模块
var pageModule = angular.module("pageModule", []);
//var page = pageService.page(current, total);
//pageService.prev(page, run)/pageService.next(page, run)/pageService.pageTo(page, run);
pageModule.service("page", function () {
    //生成关于分页的信息
    return {
        page: function (load, orderBy, asc) {
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
        }
    }
});