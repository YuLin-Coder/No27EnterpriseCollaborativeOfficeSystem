package com.justerdu.io.user.model;

import javax.persistence.*;

@Entity
@Table(name = "tb_companyinfo")
public class CompanyInfo {
	@Id
	@GeneratedValue
	private Integer id;
	@Column(name = "company_name")
	private String companyName;
	private String introduce;
	private String address;
	private String phone;
	private String postcode;

	public CompanyInfo() {
		super();
	}

	public CompanyInfo(String companyName, String introduce, String address,
			String phone, String postcode) {
		super();
		this.companyName = companyName;
		this.introduce = introduce;
		this.address = address;
		this.phone = phone;
		this.postcode = postcode;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getIntroduce() {
		return introduce;
	}

	public void setIntroduce(String introduce) {
		this.introduce = introduce;
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

	public String getPostcode() {
		return postcode;
	}

	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

}