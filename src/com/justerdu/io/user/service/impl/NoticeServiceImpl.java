package com.justerdu.io.user.service.impl;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.dao.INoticeDao;
import com.justerdu.io.user.service.INoticeService;
import com.justerdu.io.user.model.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class NoticeServiceImpl implements INoticeService {
    @Autowired
    private INoticeDao noticeDao;

    @Override
    public Notice addOneNotice(String noticeItem, String noticeContent) throws Exception {
    	Notice notice = new Notice(noticeItem, noticeContent, new Date());
    	noticeDao.save(notice);
        return notice;
    }

    @Override
    public Notice getOneNotice(int id) throws Exception {
        return noticeDao.findOne(" from Notice n where n.id='" + id + "' ");
    }

    @Override
    public boolean deleteOneNotice(int id) throws Exception {
    	noticeDao.deleteWithHql(" delete from Notice n where n.id='" + id + "' ");
        return true;
    }

    @Override
    public Notice updateOneNotice(int id, String noticeItem, String noticeContent) throws Exception {
    	Notice notice = noticeDao.getOne(id);
    	notice.setNoticeItem(noticeItem);
    	notice.setNoticeContent(noticeContent);
        return noticeDao.update(notice);
    }
    
    @Override
    public Page<Notice> getNoticePageList(int current, int size, String search) throws Exception {
        String hql = " from Notice n where (n.noticeItem like '%" + search + "%' or n.noticeContent like '%" + search + "%' )" ;
        String countHql = " select count(*) from Notice n where  (n.noticeItem like '%" + search + "%' or n.noticeContent like '%" + search + "%' )";
        return noticeDao.findPage(current, size, hql, countHql);
    }

}
