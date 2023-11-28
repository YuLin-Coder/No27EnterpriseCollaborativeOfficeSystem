package com.justerdu.io.user.controller;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.ResponseMap;
import com.justerdu.io.user.model.Salary;
import com.justerdu.io.user.service.ISalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/salary")
public class SalaryController {
    @Autowired
    private ISalaryService salaryService;

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/addOneSalary", method = RequestMethod.GET)
    public Map addOneSalary(HttpServletRequest request, String salaryItem, int userId, float salaryValue) {
        ResponseMap map = ResponseMap.getInstance();
        Salary salary = null;
        try {
        	salaryItem = new String(request.getParameter("salaryItem"));
        	
        	salary = salaryService.addOneSalary(salaryItem, userId, salaryValue);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(salary, "交互成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getOneSalary", method = RequestMethod.GET)
    public Map getOneSalary(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        Salary salary = null;
        try {
        	salary = salaryService.getOneSalary(id);
            if (salary == null) {
                return map.putFailure("获取信息失败", 101);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(salary);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/deleteOneSalary", method = RequestMethod.GET)
    public Map deleteOneSalary(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        try {
        	salaryService.deleteOneSalary(id);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("删除成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updateOneSalary", method = RequestMethod.GET)
    public Map updateOneSalary(HttpServletRequest request, int id, String salaryItem, float salaryValue) {
        ResponseMap map = ResponseMap.getInstance();
        Salary salary = null;
        try {
        	salaryItem = new String(request.getParameter("salaryItem"));
        	
        	salary = salaryService.updateOneSalary(id, salaryItem, salaryValue);
            if (salary == null) {
                return map.putFailure("该信息已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(salary, "修改成功");
    }

    
    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getSalaryPageList", method = RequestMethod.GET)
    public Map getSalaryPageList(HttpServletRequest request, int current, int size, String search) {
        ResponseMap map = ResponseMap.getInstance();
        Page<Salary> salaryPage;
        try {
        	search = new String(request.getParameter("search"));
        	salaryPage = salaryService.getSalaryPageList(current, size, search);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(salaryPage);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getSalaryPageListByUserId", method = RequestMethod.GET)
    public Map getSalaryPageListByUserId(HttpServletRequest request, int current, int size, String search, int userId) {
        ResponseMap map = ResponseMap.getInstance();
        Page<Salary> salaryPage;
        try {
        	search = new String(request.getParameter("search"));
        	salaryPage = salaryService.getSalaryPageListByUserId(current, size, search, userId);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(salaryPage);
    }
}
