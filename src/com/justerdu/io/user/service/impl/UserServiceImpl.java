package com.justerdu.io.user.service.impl;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.dao.IUserDao;
import com.justerdu.io.user.service.IUserService;
import com.justerdu.io.base.vo.Parameter;
import com.justerdu.io.user.model.User;
import com.justerdu.io.user.vo.UserVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private IUserDao userDao;

    @Override
    public User addOneUser(String username, String password, String realname, int age, String sex, String address, String phone, String avatar, String role) throws Exception {
        if (userDao.findOne(" from User u where u.username='" + username + "' ") != null) {
            return null;
        }

        User user = new User(username, password, realname, age, sex, address, phone, avatar, role, new Date());
        userDao.save(user);
        return user;
    }

    @Override
    public User getOneUser(int id) throws Exception {
        return userDao.findOne(" from User u where u.id='" + id + "' ");
    }

    @Override
    public boolean deleteOneUser(int id) throws Exception {
        userDao.deleteWithHql(" delete from User u where u.id='" + id + "' ");
        return true;
    }

    @Override
    public Page<User> getUserPageList(int current, int size, String search, String roleType) throws Exception {
        String hql = " from User u where u.role = '" + roleType + "' and (u.username like '%" + search + "%' or u.realname like '%" + search + "%' or u.address like '%" + search + "%' )" ;
        String countHql = " select count(*) from User u where u.role = '" + roleType + "' and (u.username like '%" + search + "%' or u.realname like '%" + search + "%' or u.address like '%" + search + "%' )";

        return userDao.findPage(current, size, hql, countHql);
    }

    @Override
    public User updateOneUser(int id, String username, String address, String phone, String avatar) throws Exception {
        User user = userDao.getOne(id);

        User temp = userDao.findOne(" from User u where u.username='" + username + "'");
        if (temp != null && !temp.getId().equals(id)) {
            return null;//用户名已存在
        }

        user.setUsername(username);
        user.setAddress(address);
        user.setPhone(phone);
        user.setAvatar(avatar);
        
        return userDao.update(user);
    }


    @Override
    public boolean updateAvatar(int id, String avatar, String avatarThumb) throws Exception {
        userDao.update("update User u set u.avatar =:p0 where u.id =:p1", new Parameter(avatar, id));
        return true;
    }

    @Override
    public User updatePwdByOld(int id, String oldPwd, String newPwd) throws Exception {
        User user = userDao.getOne(id);
        if (user.getPassword().equals(oldPwd)) {
            user.setPassword(newPwd);
            userDao.update(user);
        } else {
            return null;
        }

        return user;
    }

    @Override
    public User updatePwdByAdmin(int id, String newPwd) throws Exception {
        User user = userDao.getOne(id);
        user.setPassword(newPwd);//管理员强制修改密码
        userDao.update(user);
        return user;
    }

    @Override
    public UserVo loginApp(String username, String password) throws Exception {
        UserVo userVo = new UserVo();
        User user = userDao.findOne(" from User u where u.username='" + username + "' ");
        if (user == null) {
            return userVo.setSuccess(false).setMessage("用户不存在").setUser(null);
        }
        if (!user.getPassword().equals(password)) {
            return userVo.setSuccess(false).setMessage("密码错误").setUser(null);
        }
        return userVo.setSuccess(true).setMessage("登录成功").setUser(user);
    }

    @Override
    public UserVo loginAdmin(String token, String username, String password) throws Exception {

        return null;
    }
}
