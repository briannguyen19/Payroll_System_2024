package com.microservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.account.model.Manager;

public interface ManagerRepository extends JpaRepository<Manager, Integer>{

}
