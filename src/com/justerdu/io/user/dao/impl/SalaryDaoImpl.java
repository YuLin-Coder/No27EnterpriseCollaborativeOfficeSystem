package com.justerdu.io.user.dao.impl;

import com.justerdu.io.base.dao.impl.BaseDaoImpl;
import com.justerdu.io.user.dao.INoticeDao;
import com.justerdu.io.user.model.Notice;
import org.springframework.stereotype.Component;

@Component
public class SalaryDaoImpl extends BaseDaoImpl<Notice> implements INoticeDao {
    public SalaryDaoImpl() {
        super(Notice.class);
    }
}
