package com.justerdu.io.user.service;

import com.justerdu.io.base.vo.Page;
import com.justerdu.io.user.model.Notice;

public interface INoticeService {

    //新增公告信息
	Notice addOneNotice(String noticeItem, String noticeContent) throws Exception;

    //根据id获取公告信息
	Notice getOneNotice(int id) throws Exception;

    //根据id删除公告信息
    boolean deleteOneNotice(int id) throws Exception;

    //编辑公告信息
    Notice updateOneNotice(int id, String noticeItem, String noticeContent) throws Exception;

    //获取公告信息列表
    Page<Notice> getNoticePageList(int current, int size, String search) throws Exception;

}
