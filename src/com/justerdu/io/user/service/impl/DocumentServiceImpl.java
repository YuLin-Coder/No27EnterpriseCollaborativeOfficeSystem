package com.justerdu.io.user.service.impl;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.dao.IDocumentDao;
import com.justerdu.io.user.service.IDocumentService;
import com.justerdu.io.base.vo.Parameter;
import com.justerdu.io.user.model.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DocumentServiceImpl implements IDocumentService {
    @Autowired
    private IDocumentDao documentDao;

    @Override
    public Document addOneDocument(String docItem, String introduce, String avatar) throws Exception {
    	
    	Document document = new Document(docItem, introduce, avatar, new Date());
    	documentDao.save(document);
        return document;
    }

    @Override
    public Document getOneDocument(int id) throws Exception {
        return documentDao.findOne(" from Document d where d.id='" + id + "' ");
    }

    @Override
    public boolean deleteOneDocument(int id) throws Exception {
    	documentDao.deleteWithHql(" delete from Document d where d.id='" + id + "' ");
        return true;
    }

    @Override
    public Document updateOneDocument(int id, String docItem, String introduce) throws Exception {
    	Document document = documentDao.getOne(id);
    	document.setDocItem(docItem);
    	document.setIntroduce(introduce);
        return documentDao.update(document);
    }
    
    @Override
    public Page<Document> getDocumentPageList(int current, int size, String search) throws Exception {
        String hql = " from Document d where (d.docItem like '%" + search + "%' or d.introduce like '%" + search + "%' )" ;
        String countHql = " select count(*) from Document d where (d.docItem like '%" + search + "%' or d.introduce like '%" + search + "%' )";

        return documentDao.findPage(current, size, hql, countHql);
    }

    @Override
    public boolean updateAvatar(int id, String avatar, String avatarThumb) throws Exception {
    	documentDao.update("update Document d set d.avatar =:p0 where d.id =:p1", new Parameter(avatar, id));
        return true;
    }

}
