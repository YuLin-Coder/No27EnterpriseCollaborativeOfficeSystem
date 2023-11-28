package com.justerdu.io.user.dao.impl;

import com.justerdu.io.base.dao.impl.BaseDaoImpl;
import com.justerdu.io.user.dao.ISalaryDao;
import com.justerdu.io.user.model.Salary;
import org.springframework.stereotype.Component;

@Component
public class NoticeDaoImpl extends BaseDaoImpl<Salary> implements ISalaryDao {
    public NoticeDaoImpl() {
        super(Salary.class);
    }
}
