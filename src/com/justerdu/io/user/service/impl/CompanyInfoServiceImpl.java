package com.justerdu.io.user.service.impl;

import com.justerdu.io.user.dao.ICompanyInfoDao;
import com.justerdu.io.user.service.ICompanyInfoService;
import com.justerdu.io.user.model.CompanyInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyInfoServiceImpl implements ICompanyInfoService {
    @Autowired
    private ICompanyInfoDao companyInfoDao;

    @Override
    public CompanyInfo addOneCompanyInfo(String companyName, String introduce, String address, String phone, String postcode) throws Exception {
    	CompanyInfo companyInfo = new CompanyInfo(companyName, introduce, address, phone, postcode);
    	companyInfoDao.save(companyInfo);
        return companyInfo;
    }

    @Override
    public CompanyInfo getOneCompanyInfo(int id) throws Exception {
        return companyInfoDao.findOne(" from CompanyInfo c where c.id='" + id + "' ");
    }
    
    @Override
    public CompanyInfo updateOneCompanyInfo(int id, String companyName, String introduce, String address, String phone, String postcode) throws Exception {
    	CompanyInfo companyInfo = companyInfoDao.getOne(id);
    	companyInfo.setCompanyName(companyName);
    	companyInfo.setIntroduce(introduce);
    	companyInfo.setAddress(address);
    	companyInfo.setPhone(phone);
    	companyInfo.setPostcode(postcode);
        return companyInfoDao.update(companyInfo);
    }
    
}
