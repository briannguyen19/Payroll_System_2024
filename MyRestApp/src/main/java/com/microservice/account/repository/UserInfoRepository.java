package com.microservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.account.model.UserInfo;

public interface UserInfoRepository extends JpaRepository<UserInfo, Integer>{

	UserInfo findByUsername(String username);

}
