package com.justerdu.io.user.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.ResponseMap;
import com.justerdu.io.user.model.User;
import com.justerdu.io.user.service.ICheckService;
import com.justerdu.io.user.service.ISalaryService;
import com.justerdu.io.user.service.IUserService;
import com.justerdu.io.user.vo.UserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(value = "/user")
public class UserController {
    @Autowired
    private IUserService userService;
    @Autowired
    private ICheckService checkService;
    @Autowired
    private ISalaryService salaryService;

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/addOneUser", method = RequestMethod.GET)
    public Map addOneUser(HttpServletRequest request, String username, String password, String realname, int age, String sex, String address, String phone, String avatar, String role) {
        ResponseMap map = ResponseMap.getInstance();
        User user = null;
        try {
        	username = new String(request.getParameter("username"));
        	password = new String(request.getParameter("password"));
        	realname = new String(request.getParameter("realname"));
        	sex = new String(request.getParameter("sex"));
        	address = new String(request.getParameter("address"));
        	phone = new String(request.getParameter("phone"));
        	role = new String(request.getParameter("role"));

            user = userService.addOneUser(username, password, realname, age, sex, address, phone, avatar, role);
            if (user == null) {
                return map.putFailure("该用户名已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(user, "注册成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getOneUser", method = RequestMethod.GET)
    public Map getOneUser(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        User user = null;
        try {
            user = userService.getOneUser(id);
            if (user == null) {
                return map.putFailure("获取用户信息失败", 101);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(user);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/deleteOneUser", method = RequestMethod.GET)
    public Map deleteOneUser(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        try {
        	// 先删除该用户对应的考勤信息和薪资信息
        	checkService.deleteCheckByUserId(id);
            salaryService.deleteSalaryByUserId(id);
            userService.deleteOneUser(id);

        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("删除成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getUserPageList", method = RequestMethod.GET)
    public Map getUserPageList(HttpServletRequest request, int current, int size, String search, String roleType) {
        ResponseMap map = ResponseMap.getInstance();
        Page<User> userPage;
        try {
        	search = new String(request.getParameter("search"));
            userPage = userService.getUserPageList(current, size, search, roleType);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(userPage);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updateOneUser", method = RequestMethod.GET)
    public Map updateOneUser(HttpServletRequest request, int id, String username, String address, String phone, String avatar) {
        ResponseMap map = ResponseMap.getInstance();
        User user = null;
        try {
        	username = new String(request.getParameter("username"));
        	address = new String(request.getParameter("address"));
        	phone = new String(request.getParameter("phone"));
        	
            user = userService.updateOneUser(id, username, address, phone, avatar);
            if (user == null) {
                return map.putFailure("该用户名已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(user, "修改成功");
    }


    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updatePwdByOld", method = RequestMethod.GET)
    public Map updatePwdByOld(HttpServletRequest request, int id, String oldPwd, String newPwd) {
        ResponseMap map = ResponseMap.getInstance();
        try {
            User user = userService.updatePwdByOld(id, oldPwd, newPwd);
            if (user == null) {
                return map.putFailure("旧密码不正确", 103);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("操作成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updatePwdByAdmin", method = RequestMethod.GET)
    public Map updatePwdByAdmin(HttpServletRequest request, int id, String newPwd) {
        ResponseMap map = ResponseMap.getInstance();
        try {
            userService.updatePwdByAdmin(id, newPwd);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("操作成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/loginApp", method = RequestMethod.GET)
    public Map loginApp(HttpServletRequest request, HttpServletResponse response, String username, String password) {
        ResponseMap map = ResponseMap.getInstance();
        UserVo userVo = null;
        try {
            userVo = userService.loginApp(username, password);
            if (!userVo.isSuccess()) {
                return map.putFailure(userVo.getMessage(), 108);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        request.getSession().setAttribute("user",userVo.getUser());
        Cookie cookie = null;
        try {
            cookie = new Cookie("user", new ObjectMapper().writeValueAsString(userVo.getUser()));
            cookie.setPath("/");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        response.addCookie(cookie);
        return map.putValue(userVo.getUser(), "登录成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/loginAdmin", method = RequestMethod.GET)
    public Map loginAdmin(HttpServletRequest request, HttpServletResponse response, String username, String password) {
        ResponseMap map = ResponseMap.getInstance();
        String token = UUID.randomUUID().toString();
        try {
            UserVo result = userService.loginAdmin(token, username, password);
            if (result != null) {
                Cookie cookie = new Cookie("token", token);
                cookie.setPath("/");
                response.addCookie(cookie);
                request.getSession().setAttribute("token",token);
                return map.putValue(result, "管理员登录成功");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putFailure("用户名或密码错误", 105);
    }
}
