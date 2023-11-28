package com.justerdu.io.user.service;

import com.justerdu.io.user.model.CompanyInfo;

public interface ICompanyInfoService {

    //新增公司信息
	CompanyInfo addOneCompanyInfo(String companyName, String introduce, String address, String phone, String postcode) throws Exception;

	//根据id获取公司信息
	CompanyInfo getOneCompanyInfo(int id) throws Exception;
		
    //编辑公司信息
	CompanyInfo updateOneCompanyInfo(int id, String companyName, String introduce, String address, String phone, String postcode) throws Exception;

}
