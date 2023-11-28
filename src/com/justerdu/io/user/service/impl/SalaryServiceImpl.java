package com.justerdu.io.user.service.impl;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.dao.ISalaryDao;
import com.justerdu.io.user.dao.IUserDao;
import com.justerdu.io.user.service.ISalaryService;
import com.justerdu.io.user.model.Salary;
import com.justerdu.io.user.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class SalaryServiceImpl implements ISalaryService {
    @Autowired
    private ISalaryDao salaryDao;
    @Autowired
    private IUserDao userDao;

    @Override
    public Salary addOneSalary(String salaryItem, int userId, float salaryValue) throws Exception {
    	Salary salary = null;
    	User user = userDao.findOne(" from User u where u.id='" + userId + "' ");
    	if (user != null) {
    		salary = new Salary(salaryItem, user, salaryValue, new Date());
    		salaryDao.save(salary);
    	}
        return salary;
    }

    @Override
    public Salary getOneSalary(int id) throws Exception {
        return salaryDao.findOne(" from Salary s where s.id='" + id + "' ");
    }

    @Override
    public boolean deleteOneSalary(int id) throws Exception {
    	salaryDao.deleteWithHql(" delete from Salary s where s.id='" + id + "' ");
        return true;
    }

    @Override
    public Salary updateOneSalary(int id, String salaryItem, float salaryValue) throws Exception {
    	Salary salary = salaryDao.getOne(id);
    	salary.setSalaryItem(salaryItem);
    	salary.setSalaryValue(salaryValue);
        return salaryDao.update(salary);
    }
    
    @Override
    public Page<Salary> getSalaryPageList(int current, int size, String search) throws Exception {
        String hql = " from Salary s where (s.salaryItem like '%" + search + "%' or s.salaryValue like '%" + search + "%' )" ;
        String countHql = " select count(*) from Salary s where  (s.salaryItem like '%" + search + "%' or s.salaryValue like '%" + search + "%' )";
        return salaryDao.findPage(current, size, hql, countHql);
    }

    @Override
    public Page<Salary> getSalaryPageListByUserId(int current, int size, String search, int userId) throws Exception {
        String hql = " from Salary s where s.userId.id = '" + userId + "' and (s.salaryItem like '%" + search + "%' or s.salaryValue like '%" + search + "%' )";
        String countHql = " select count(*) from Salary s where s.userId.id = '" + userId + "' and (s.salaryItem like '%" + search + "%' or s.salaryValue like '%" + search + "%' )";

        return salaryDao.findPage(current, size, hql, countHql);
    }
    
    @Override
    public boolean deleteSalaryByUserId(int userId) throws Exception {
    	salaryDao.deleteWithHql(" delete from Salary s where s.userId.id='" + userId + "' ");
        return true;
    }
}
