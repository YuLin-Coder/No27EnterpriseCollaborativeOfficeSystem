package com.justerdu.io.user.service;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.model.User;
import com.justerdu.io.user.vo.UserVo;

public interface IUserService {

    //新增用户(用户注册)
    User addOneUser(String username, String password, String realname, int age, String sex, String address, String phone, String avatar, String role) throws Exception;

    //获取一个用户
    User getOneUser(int id) throws Exception;

    //删除一个用户
    boolean deleteOneUser(int id) throws Exception;

    //获取用户列表
    Page<User> getUserPageList(int current, int size, String search, String roleType) throws Exception;

    //编辑用户
    User updateOneUser(int id, String username, String address, String phone, String avatar) throws Exception;

    //更换用户头像
    boolean updateAvatar(int id, String avatar, String avatarThumb) throws Exception;

    //用原密码修改密码
    User updatePwdByOld(int id, String oldPwd, String newPwd) throws Exception;

    //管理员强制修改密码
    User updatePwdByAdmin(int id, String newPwd) throws Exception;

    //用户登录(非管理员)
    UserVo loginApp(String username, String password) throws Exception;

    //管理员登录
    UserVo loginAdmin(String token, String username, String password) throws Exception;
}
