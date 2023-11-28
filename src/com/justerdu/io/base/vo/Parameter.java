package com.justerdu.io.base.vo;

import java.util.HashMap;

public class Parameter extends HashMap<String, Object> {

    private static final long serialVersionUID = 1L;

    /**
     * 构造类，例：new Parameter(id, parentIds)
     *
     * @param values 参数值
     */
    public Parameter(Object... values) {
        if (values != null) {
            for (int i = 0; i < values.length; i++) {
                put("p" + i, values[i]);
            }
        }
    }

    /**
     * 构造类，例：new Parameter(new Object[][]{{"id", id}, {"parentIds", parentIds}})
     *
     * @param parameters 参数二维数组
     */
    public Parameter(Object[][] parameters) {
        if (parameters != null) {
            for (Object[] os : parameters) {
                if (os.length == 2) {
                    put((String) os[0], os[1]);
                }
            }
        }
    }

}