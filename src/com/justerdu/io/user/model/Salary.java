package com.justerdu.io.user.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_salary")
public class Salary {
	@Id
	@GeneratedValue
	private Integer id;
	@Column(name = "salary_item")
	private String salaryItem;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User userId;
	@Column(name = "salary_value")
	private float salaryValue;
	@Column(name = "create_time")
	private Date createTime;

	public Salary() {
		super();
	}

	public Salary(String salaryItem, User userId, float salaryValue,
			Date createTime) {
		super();
		this.salaryItem = salaryItem;
		this.userId = userId;
		this.salaryValue = salaryValue;
		this.createTime = createTime;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSalaryItem() {
		return salaryItem;
	}

	public void setSalaryItem(String salaryItem) {
		this.salaryItem = salaryItem;
	}

	public User getUserId() {
		return userId;
	}

	public void setUserId(User userId) {
		this.userId = userId;
	}

	public float getSalaryValue() {
		return salaryValue;
	}

	public void setSalaryValue(float salaryValue) {
		this.salaryValue = salaryValue;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}