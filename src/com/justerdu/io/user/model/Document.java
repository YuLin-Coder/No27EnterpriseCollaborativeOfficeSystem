package com.justerdu.io.user.model;

import java.util.Date;

import javax.persistence.*;

@Entity
@Table(name = "tb_document")
public class Document {
	@Id
	@GeneratedValue
	private Integer id;
	@Column(name = "doc_item")
	private String docItem;
	private String introduce;
	private String avatar;
	private Date time;

	public Document() {
		super();
	}

	public Document(String docItem, String introduce, String avatar, Date time) {
		super();
		this.docItem = docItem;
		this.introduce = introduce;
		this.avatar = avatar;
		this.time = time;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDocItem() {
		return docItem;
	}

	public void setDocItem(String docItem) {
		this.docItem = docItem;
	}

	public String getIntroduce() {
		return introduce;
	}

	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

}