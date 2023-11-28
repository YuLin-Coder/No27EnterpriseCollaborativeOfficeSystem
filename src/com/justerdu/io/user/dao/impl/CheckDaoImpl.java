package com.justerdu.io.user.dao.impl;

import com.justerdu.io.base.dao.impl.BaseDaoImpl;
import com.justerdu.io.user.dao.ICheckDao;
import com.justerdu.io.user.model.Check;
import org.springframework.stereotype.Component;

@Component
public class CheckDaoImpl extends BaseDaoImpl<Check> implements ICheckDao {
    public CheckDaoImpl() {
        super(Check.class);
    }
}
