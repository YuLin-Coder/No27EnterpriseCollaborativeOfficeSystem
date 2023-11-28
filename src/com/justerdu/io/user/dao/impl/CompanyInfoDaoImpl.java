package com.justerdu.io.user.dao.impl;

import com.justerdu.io.base.dao.impl.BaseDaoImpl;
import com.justerdu.io.user.dao.ICompanyInfoDao;
import com.justerdu.io.user.model.CompanyInfo;
import org.springframework.stereotype.Component;

@Component
public class CompanyInfoDaoImpl extends BaseDaoImpl<CompanyInfo> implements ICompanyInfoDao {
    public CompanyInfoDaoImpl() {
        super(CompanyInfo.class);
    }
}
