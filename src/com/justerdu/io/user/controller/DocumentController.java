package com.justerdu.io.user.controller;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.base.vo.ResponseMap;
import com.justerdu.io.user.model.Document;
import com.justerdu.io.user.service.IDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value = "/document")
public class DocumentController {
    @Autowired
    private IDocumentService documentService;

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/addOneDocument", method = RequestMethod.GET)
    public Map addOneDocument(HttpServletRequest request, String docItem, String introduce, String avatar) {
        ResponseMap map = ResponseMap.getInstance();
        Document document = null;
        try {
        	docItem = new String(request.getParameter("docItem"));
        	introduce = new String(request.getParameter("introduce"));
        	document = documentService.addOneDocument(docItem, introduce, avatar);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(document, "交互成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getOneDocument", method = RequestMethod.GET)
    public Map getOneDocument(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        Document document = null;
        try {
        	document = documentService.getOneDocument(id);
            if (document == null) {
                return map.putFailure("获取信息失败", 101);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(document);
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/deleteOneDocument", method = RequestMethod.GET)
    public Map deleteOneDocument(HttpServletRequest request, int id) {
        ResponseMap map = ResponseMap.getInstance();
        try {
        	documentService.deleteOneDocument(id);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putSuccess("删除成功");
    }
    
    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/updateOneDocument", method = RequestMethod.GET)
    public Map updateOneDocument(HttpServletRequest request, int id, String docItem, String introduce) {
        ResponseMap map = ResponseMap.getInstance();
        Document document = null;
        try {
        	docItem = new String(request.getParameter("docItem"));
        	introduce = new String(request.getParameter("introduce"));
        	
        	document = documentService.updateOneDocument(id, docItem, introduce);
            if (document == null) {
                return map.putFailure("该用户名已存在", 100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putValue(document, "修改成功");
    }

    @SuppressWarnings("rawtypes")
	@RequestMapping(value = "/getDocumentPageList", method = RequestMethod.GET)
    public Map getDocumentPageList(HttpServletRequest request, int current, int size, String search) {
        ResponseMap map = ResponseMap.getInstance();
        Page<Document> documentPage;
        try {
        	search = new String(request.getParameter("search"));
        	documentPage = documentService.getDocumentPageList(current, size, search);
        } catch (Exception e) {
            e.printStackTrace();
            return map.putFailure("交互失败", 1);
        }

        return map.putPage(documentPage);
    }

   
   

    

    
}
