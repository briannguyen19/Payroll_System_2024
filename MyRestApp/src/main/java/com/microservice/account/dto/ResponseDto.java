package com.microservice.account.dto;

public class ResponseDto {
	private String msg;
	private String statusCode;

	public ResponseDto(String msg, String statusCode) {
		super();
		this.msg = msg;
		this.statusCode = statusCode;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

}
