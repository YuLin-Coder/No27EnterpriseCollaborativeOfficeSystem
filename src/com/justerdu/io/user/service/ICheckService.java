package com.justerdu.io.user.service;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.model.Check;

public interface ICheckService {

    //新增考勤信息
	Check addOneCheck(String checkItem, int userId, String remark) throws Exception;

    //根据id获取考勤信息
	Check getOneCheck(int id) throws Exception;
	
    //根据id删除考勤信息
    boolean deleteOneCheck(int id) throws Exception;

    //编辑考勤信息
    Check updateOneCheck(int id, String checkItem, String remark) throws Exception;

    //获取考勤信息列表
    Page<Check> getCheckPageList(int current, int size, String search) throws Exception;

    //根据用户id获取其对应的考勤信息列表
    Page<Check> getCheckPageListByUserId(int current, int size, String search, int userId) throws Exception;

    //删除userId对应的考勤信息
    boolean deleteCheckByUserId(int userId) throws Exception;
}
