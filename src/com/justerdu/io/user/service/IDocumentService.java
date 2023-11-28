package com.justerdu.io.user.service;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.model.Document;

public interface IDocumentService {

    //新增文档
	Document addOneDocument(String docItem, String introduce, String avatar) throws Exception;

    //获取一个文档
	Document getOneDocument(int id) throws Exception;

    //删除一个文档
    boolean deleteOneDocument(int id) throws Exception;

    //编辑文档
    Document updateOneDocument(int id, String docItem, String introduce) throws Exception;

    //获取文档列表
    Page<Document> getDocumentPageList(int current, int size, String search) throws Exception;
    
    //更换文档图片
    boolean updateAvatar(int id, String avatar, String avatarThumb) throws Exception;

}
