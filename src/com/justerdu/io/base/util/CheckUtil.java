package com.justerdu.io.base.util;

import java.util.List;

public class CheckUtil {

    public static boolean isNotEmpty(String... s) {
        if (s == null) {
            return false;
        }
        for (String string : s) {
            if (string != null && !string.isEmpty() && !string.equals("null")) continue;
            return false;
        }
        return true;
    }

    public static boolean isNotEmpty(List list) {
        if (list == null || list.size() == 0) {
            return false;
        }
        return true;
    }

    public static boolean isLtZero(Double... ds) {
        for (Double d : ds) {
            if (d != null && d > 0) continue;
            return false;
        }
        return true;
    }

    public static boolean isLtZero(Integer... i) {
        for (Integer integer : i) {
            if (integer != null && integer > 0) continue;
            return false;
        }
        return true;
    }

    public static boolean isLetZero(Integer... i) {
        for (Integer integer : i) {
            if (integer != null && integer >= 0) continue;
            return false;
        }
        return true;
    }

    public static boolean isNotNull(Object... o) {
        for (Object object : o) {
            if (object != null) continue;
            return false;
        }
        return true;
    }


}
