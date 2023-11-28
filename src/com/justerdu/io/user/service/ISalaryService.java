package com.justerdu.io.user.service;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.model.Salary;

public interface ISalaryService {

    //新增薪资信息
	Salary addOneSalary(String salaryItem, int userId, float salaryValue) throws Exception;

    //根据id获取薪资信息
	Salary getOneSalary(int id) throws Exception;

    //根据id删除薪资信息
    boolean deleteOneSalary(int id) throws Exception;

    //编辑薪资信息
    Salary updateOneSalary(int id, String salaryItem, float salaryValue) throws Exception;

    //获取薪资信息列表
    Page<Salary> getSalaryPageList(int current, int size, String search) throws Exception;

    //根据用户id获取其对应的薪资信息列表
    Page<Salary> getSalaryPageListByUserId(int current, int size, String search, int userId) throws Exception;

    //删除userId对应的考勤信息
    boolean deleteSalaryByUserId(int userId) throws Exception;
}
