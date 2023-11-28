package com.justerdu.io.user.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_notice")
public class Notice {
	@Id
	@GeneratedValue
	private Integer id;
	@Column(name = "notice_item")
	private String noticeItem;
	@Column(name = "notice_content")
	private String noticeContent;
	@Column(name = "create_time")
	private Date createTime;

	public Notice() {
		super();
	}

	public Notice(String noticeItem, String noticeContent, Date createTime) {
		super();
		this.noticeItem = noticeItem;
		this.noticeContent = noticeContent;
		this.createTime = createTime;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNoticeItem() {
		return noticeItem;
	}

	public void setNoticeItem(String noticeItem) {
		this.noticeItem = noticeItem;
	}

	public String getNoticeContent() {
		return noticeContent;
	}

	public void setNoticeContent(String noticeContent) {
		this.noticeContent = noticeContent;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}