package com.justerdu.io.user.service.impl;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.dao.ICheckDao;
import com.justerdu.io.user.dao.IUserDao;
import com.justerdu.io.user.service.ICheckService;
import com.justerdu.io.user.model.Check;
import com.justerdu.io.user.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class CheckServiceImpl implements ICheckService {
    @Autowired
    private ICheckDao checkDao;
    @Autowired
    private IUserDao userDao;

    @Override
    public Check addOneCheck(String checkItem, int userId, String remark) throws Exception {
    	Check check = null;
    	User user = userDao.findOne(" from User u where u.id='" + userId + "' ");
    	if (user != null) {
    		check = new Check(checkItem, user, remark, new Date());
    		checkDao.save(check);
    	}
        return check;
    }

    @Override
    public Check getOneCheck(int id) throws Exception {
        return checkDao.findOne(" from Check c where c.id='" + id + "' ");
    }

    @Override
    public boolean deleteOneCheck(int id) throws Exception {
    	checkDao.deleteWithHql(" delete from Check c where c.id='" + id + "' ");
        return true;
    }

    @Override
    public Check updateOneCheck(int id, String checkItem, String remark) throws Exception {
    	Check check = checkDao.getOne(id);
    	check.setCheckItem(checkItem);
    	check.setRemark(remark);
        return checkDao.update(check);
    }
    
    @Override
    public Page<Check> getCheckPageList(int current, int size, String search) throws Exception {
        String hql = " from Check c where (c.checkItem like '%" + search + "%' or c.remark like '%" + search + "%' )" ;
        String countHql = " select count(*) from Check c where  (c.checkItem like '%" + search + "%' or c.remark like '%" + search + "%' )";
        return checkDao.findPage(current, size, hql, countHql);
    }

    @Override
    public Page<Check> getCheckPageListByUserId(int current, int size, String search, int userId) throws Exception {
        String hql = " from Check c where c.userId.id = '" + userId + "' and (c.checkItem like '%" + search + "%' or c.remark like '%" + search + "%' )";
        String countHql = " select count(*) from Check c where c.userId.id = '" + userId + "' and (c.checkItem like '%" + search + "%' or c.remark like '%" + search + "%' )";

        return checkDao.findPage(current, size, hql, countHql);
    }
    
    @Override
    public boolean deleteCheckByUserId(int userId) throws Exception {
    	checkDao.deleteWithHql(" delete from Check c where c.userId.id='" + userId + "' ");
        return true;
    }
}
