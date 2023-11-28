package com.justerdu.io.qiniu.controller;

import com.justerdu.io.base.vo.ResponseMap;
import com.qiniu.util.Auth;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping(value = "/qiniu")
public class UpTokenController {
    Logger logger = Logger.getLogger(UpTokenController.class);

    @SuppressWarnings("unused")
	@RequestMapping(value = "/upToken")
    public String fileUpload(HttpServletRequest request) throws Exception {
        ResponseMap map = ResponseMap.getInstance();

//        String accessKey = "q4na_153VieL4zqMbr27YsAi2g7zqW2fhicHqJ8J";
//        String secretKey = "CYmU5Iuk10bB8S_f_oFwaohxNtog-y9IsCGGdoAl";
//        String bucket = "tomasyao-picbed";
        String accessKey = "V58vhy9Y-gDQ3EpAjsS7jtTXVwtZBoD2-Pg4j_Os";
        String secretKey = "j7Jq5XFuLMkBpakIDbnvsOPmQlQ1ElEE5QTs7mga";
        String bucket = "justerdu-picbed";
        Auth auth = Auth.create(accessKey, secretKey);
        String upToken = auth.uploadToken(bucket);
        logger.info(upToken);

        //return map.putValue(upToken,"获取成功");
        return "{\"uptoken\":\"" + upToken + "\"}";
    }
}
