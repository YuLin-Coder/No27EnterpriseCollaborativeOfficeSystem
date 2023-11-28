package com.justerdu.io.base.util;

import java.util.ArrayList;
import java.util.List;

public class HqlUtil {

    public static List<String> getConditions() {
        return new ArrayList<String>();
    }

    public static String formatHql(String hql, List<String> conditions) {
        return formatHql(hql, conditions, null, false);
    }

    public static String formatHql(String hql, List<String> conditions, String orderBy, Boolean asc) {
        return formatHql(hql, conditions, orderBy, asc, null);
    }

    public static String formatHql(String hql, List<String> conditions, String orderBy, Boolean asc, String group) {
        StringBuilder str = new StringBuilder(hql);
        String and = "";
        if (conditions != null && conditions.size() > 0) {
            str.append(" where ");
            for (String s : conditions) {
                str.append(and).append(s);
                and = " and ";
            }
        }
        if (group != null && !group.isEmpty()) {
            str.append(" group by ").append(group);
        }
        if (orderBy != null && !orderBy.isEmpty()) {
            str.append(" order by ").append(orderBy).append(asc == null || asc ? " asc" : " desc");
        }
        return str.toString();
    }

}
