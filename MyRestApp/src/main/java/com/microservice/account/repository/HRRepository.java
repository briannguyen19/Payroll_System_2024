package com.microservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.account.model.HR;

public interface HRRepository extends JpaRepository<HR, Integer>{

}
