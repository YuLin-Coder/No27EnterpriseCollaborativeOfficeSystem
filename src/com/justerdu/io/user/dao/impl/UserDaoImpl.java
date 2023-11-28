package com.justerdu.io.user.dao.impl;

import com.justerdu.io.base.dao.impl.BaseDaoImpl;
import com.justerdu.io.user.dao.IUserDao;
import com.justerdu.io.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserDaoImpl extends BaseDaoImpl<User> implements IUserDao {
    public UserDaoImpl() {
        super(User.class);
    }
}
