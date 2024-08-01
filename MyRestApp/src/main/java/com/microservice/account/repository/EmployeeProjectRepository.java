package com.microservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.account.model.EmployeeProject;

public interface EmployeeProjectRepository extends JpaRepository<EmployeeProject, Integer>{

}
