package com.justerdu.io.user.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_check")
public class Check {
	@Id
	@GeneratedValue
	private Integer id;
	@Column(name = "check_item")
	private String checkItem;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User userId;
	private String remark;
	@Column(name = "create_time")
	private Date createTime;

	public Check() {
		super();
	}

	public Check(String checkItem, User userId, String remark, Date createTime) {
		super();
		this.checkItem = checkItem;
		this.userId = userId;
		this.remark = remark;
		this.createTime = createTime;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCheckItem() {
		return checkItem;
	}

	public void setCheckItem(String checkItem) {
		this.checkItem = checkItem;
	}

	public User getUserId() {
		return userId;
	}

	public void setUserId(User userId) {
		this.userId = userId;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}