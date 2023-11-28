package com.justerdu.io.user.vo;

import com.justerdu.io.user.model.User;

/**
 * 用于登录链式调用
 */
public class UserVo {
    private User user;
    private boolean success;
    private String message;

    public UserVo() {
    }

    public UserVo(User user, boolean success, String message) {
        this.user = user;
        this.success = success;
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public UserVo setUser(User user) {
        this.user = user;
        return this;
    }

    public boolean isSuccess() {
        return success;
    }

    public UserVo setSuccess(boolean success) {
        this.success = success;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public UserVo setMessage(String message) {
        this.message = message;
        return this;
    }
}
