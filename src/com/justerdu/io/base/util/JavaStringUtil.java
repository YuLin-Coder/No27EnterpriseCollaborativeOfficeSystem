package com.justerdu.io.base.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class JavaStringUtil {

    private static int counter = 0;
    private static List<Integer> listInt = new ArrayList<Integer>();

    public static void setListInt(List<Integer> listInt) {
        JavaStringUtil.listInt = listInt;
    }

    //随机生成8位字符串(由数字构成)
    public static String randomStr(int num) {
        StringBuilder str = new StringBuilder();//定义变长字符串
        Random random = new Random();
        //随机生成数字，并添加到字符串
        for (int i = 0; i < num; i++) {
            str.append(random.nextInt(10));
        }
        return str.toString();
    }

    //判断字符串str含有多少个substr子字符串
    public static int stringNumbers(String str, String substr) {
        if (str.indexOf(substr) == -1) {
            return counter;
        } else if (str.indexOf(substr) != -1) {
            counter++;
            stringNumbers(str.substring(str.indexOf(substr) + substr.length()), substr);
        }
        return counter;
    }

    //将string字符串(用"-"隔开的)变成list集合
    public static List<Integer> stringToList(String str, String substr) {
        if (str.indexOf(substr) == -1) {
            return listInt;
        } else if (str.indexOf(substr) != -1) {
            listInt.add(Integer.parseInt(str.substring(0, str.indexOf(substr))));
            stringToList(str.substring(str.indexOf(substr) + substr.length()), substr);
        }
        return listInt;
    }

}
