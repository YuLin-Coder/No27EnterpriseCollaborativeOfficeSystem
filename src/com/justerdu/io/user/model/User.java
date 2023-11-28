package com.justerdu.io.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "tb_user")
public class User {
	@Id
	@GeneratedValue
	private Integer id;
	private String username;
	@JsonIgnore
	private String password;
	private String realname;
	private int age;
	private String sex;
	private String address;
	private String phone;
	private String avatar;
	private String role;
	@Column(name = "create_time")
	private Date createTime;

	public User() {
		super();
	}

	public User(String username, String password, String realname, int age,
			String sex, String address, String phone, String avatar,
			String role, Date createTime) {
		super();
		this.username = username;
		this.password = password;
		this.realname = realname;
		this.age = age;
		this.sex = sex;
		this.address = address;
		this.phone = phone;
		this.avatar = avatar;
		this.role = role;
		this.createTime = createTime;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRealname() {
		return realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}