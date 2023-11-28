package com.justerdu.io.user.dao.impl;

import com.justerdu.io.base.dao.impl.BaseDaoImpl;
import com.justerdu.io.user.dao.IDocumentDao;
import com.justerdu.io.user.model.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentDaoImpl extends BaseDaoImpl<Document> implements IDocumentDao {
    public DocumentDaoImpl() {
        super(Document.class);
    }
}
