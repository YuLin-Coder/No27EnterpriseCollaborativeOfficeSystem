package com.justerdu.io.user.controller;

import com.justerdu.io.base.vo.ResponseMap;
import com.justerdu.io.user.model.CompanyInfo;
import com.justerdu.io.user.service.ICompanyInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/companyinfo")
public class CompanyInfoController {
    @Autowired
    private ICompanyInfoService companyInfoService;

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/addOneCompanyInfo", method = RequestMethod.GET)
    public Map addOneCompanyInfo(HttpServletRequest request, String companyName, String introduce, String address, String phone, String postcode) {
        ResponseMap map = ResponseMap.getInstance();
        CompanyInfo companyInfo = null;
        try {
        	companyName = new String(request.getParameter("companyName"));
        	introduce = new String(request.getParameter("introduce"));
        	address = new String(request.getParameter("address"));
        	phone = new String(request.getParameter("phone"));
        	postcode = new String(request.getParameter("postcode"));
        	
        	companyInfo = companyInfoService.addOneCompanyInfo(companyName, introduce, address, phone, postcode);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(companyInfo, "交互成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getOneCompanyInfo", method = RequestMethod.GET)
    public Map getOneCompanyInfo(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        CompanyInfo companyInfo = null;
        try {
        	companyInfo = companyInfoService.getOneCompanyInfo(id);
            if (companyInfo == null) {
                return map.putFailure("获取信息失败", 101);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(companyInfo);
    }
    
    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updateOneCompanyInfo", method = RequestMethod.GET)
    public Map updateOneCompanyInfo(HttpServletRequest request, int id, String companyName, String introduce, String address, String phone, String postcode) {
        ResponseMap map = ResponseMap.getInstance();
        CompanyInfo companyInfo = null;
        try {
        	companyName = new String(request.getParameter("companyName"));
        	introduce = new String(request.getParameter("introduce"));
        	address = new String(request.getParameter("address"));
        	phone = new String(request.getParameter("phone"));
        	postcode = new String(request.getParameter("postcode"));
        	
        	companyInfo = companyInfoService.updateOneCompanyInfo(id, companyName, introduce, address, phone, postcode);
            if (companyInfo == null) {
                return map.putFailure("该信息已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(companyInfo, "修改成功");
    }

}
