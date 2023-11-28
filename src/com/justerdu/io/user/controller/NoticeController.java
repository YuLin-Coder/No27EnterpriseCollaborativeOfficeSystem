package com.justerdu.io.user.controller;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.ResponseMap;
import com.justerdu.io.user.model.Notice;
import com.justerdu.io.user.service.INoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/notice")
public class NoticeController {
    @Autowired
    private INoticeService noticeService;

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/addOneNotice", method = RequestMethod.GET)
    public Map addOneNotice(HttpServletRequest request, String noticeItem, String noticeContent) {
        ResponseMap map = ResponseMap.getInstance();
        Notice notice = null;
        try {
        	noticeItem = new String(request.getParameter("noticeItem"));
        	noticeContent = new String(request.getParameter("noticeContent"));
        	
        	notice = noticeService.addOneNotice(noticeItem, noticeContent);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(notice, "交互成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getOneNotice", method = RequestMethod.GET)
    public Map getOneNotice(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        Notice notice = null;
        try {
        	notice = noticeService.getOneNotice(id);
            if (notice == null) {
                return map.putFailure("获取信息失败", 101);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(notice);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/deleteOneNotice", method = RequestMethod.GET)
    public Map deleteOneNotice(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        try {
        	noticeService.deleteOneNotice(id);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("删除成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updateOneNotice", method = RequestMethod.GET)
    public Map updateOneNotice(HttpServletRequest request, int id, String noticeItem, String noticeContent) {
        ResponseMap map = ResponseMap.getInstance();
        Notice notice = null;
        try {
        	noticeItem = new String(request.getParameter("noticeItem"));
        	noticeContent = new String(request.getParameter("noticeContent"));
        	
        	notice = noticeService.updateOneNotice(id, noticeItem, noticeContent);
            if (notice == null) {
                return map.putFailure("该信息已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(notice, "修改成功");
    }

    
    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getNoticePageList", method = RequestMethod.GET)
    public Map getNoticePageList(HttpServletRequest request, int current, int size, String search) {
        ResponseMap map = ResponseMap.getInstance();
        Page<Notice> noticePage;
        try {
        	search = new String(request.getParameter("search"));
        	noticePage = noticeService.getNoticePageList(current, size, search);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(noticePage);
    }

}
