package com.justerdu.io.file.controller;

import com.justerdu.io.base.vo.ResponseMap;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping(value = "/file")
public class FileController {
    Logger logger = Logger.getLogger(FileController.class);

    @RequestMapping("/fileUpload")
    public ResponseMap fileUpload(MultipartHttpServletRequest request) throws Exception {
        ResponseMap map = ResponseMap.getInstance();
        //String userId = request.getParameter("userId");
        //logger.info(userId);
        String path = "";
        String savePath = request.getSession().getServletContext().getRealPath("/upload/");//存储路径
        File myPath = new File(savePath);
        if (!myPath.exists()) {//若此目录不存在，则创建之// 这个东西只能一级建立文件夹，两级是无法建立的。。。。。
            myPath.mkdir();
        }

        Iterator<String> fileNames = request.getFileNames();
        while (fileNames.hasNext()) {
            String fileName = fileNames.next();
            List<MultipartFile> files = request.getFiles(fileName);
            for (MultipartFile file : files) {
                if (file != null && file.getSize() > 0) {
                    BufferedInputStream bufrs = new BufferedInputStream(file.getInputStream());
                    BufferedOutputStream out = new BufferedOutputStream(
                            new FileOutputStream(new File(savePath, file.getOriginalFilename())));// 获得文件输出流
                    byte[] by = new byte[1024];
                    while (bufrs.read(by) != -1) {
                        out.write(by);
                    }
                    path = "/upload/" + file.getOriginalFilename();
                    out.flush();
                    out.close();
                    bufrs.close();
                }
            }
        }
        return map.putValue(path, "上传成功");
    }
}
