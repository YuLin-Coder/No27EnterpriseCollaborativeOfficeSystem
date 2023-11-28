package com.justerdu.io.user.controller;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.ResponseMap;
import com.justerdu.io.user.model.Check;
import com.justerdu.io.user.service.ICheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/check")
public class CheckController {
    @Autowired
    private ICheckService checkService;

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/addOneCheck", method = RequestMethod.GET)
    public Map addOneCheck(HttpServletRequest request, String checkItem, int userId, String remark) {
        ResponseMap map = ResponseMap.getInstance();
        Check check = null;
        try {
        	checkItem = new String(request.getParameter("checkItem"));
        	remark = new String(request.getParameter("remark"));
        	
        	check = checkService.addOneCheck(checkItem, userId, remark);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(check, "交互成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getOneCheck", method = RequestMethod.GET)
    public Map getOneCheck(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        Check check = null;
        try {
        	check = checkService.getOneCheck(id);
            if (check == null) {
                return map.putFailure("获取信息失败", 101);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(check);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/deleteOneCheck", method = RequestMethod.GET)
    public Map deleteOneCheck(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        try {
        	checkService.deleteOneCheck(id);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("删除成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updateOneCheck", method = RequestMethod.GET)
    public Map updateOneCheck(HttpServletRequest request, int id, String checkItem, String remark) {
        ResponseMap map = ResponseMap.getInstance();
        Check check = null;
        try {
        	checkItem = new String(request.getParameter("checkItem"));
        	remark = new String(request.getParameter("remark"));
        	
        	check = checkService.updateOneCheck(id, checkItem, remark);
            if (check == null) {
                return map.putFailure("该信息已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(check, "修改成功");
    }

    
    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getCheckPageList", method = RequestMethod.GET)
    public Map getCheckPageList(HttpServletRequest request, int current, int size, String search) {
        ResponseMap map = ResponseMap.getInstance();
        Page<Check> checkPage;
        try {
        	search = new String(request.getParameter("search"));
        	checkPage = checkService.getCheckPageList(current, size, search);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(checkPage);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getCheckPageListByUserId", method = RequestMethod.GET)
    public Map getCheckPageListByUserId(HttpServletRequest request, int current, int size, String search, int userId) {
        ResponseMap map = ResponseMap.getInstance();
        Page<Check> checkPage;
        try {
        	search = new String(request.getParameter("search"));
        	checkPage = checkService.getCheckPageListByUserId(current, size, search, userId);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(checkPage);
    }
}
