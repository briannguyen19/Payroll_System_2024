package com.microservice.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.microservice.account.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer>{
	
	@Query("select e from Employee e "
			+ " JOIN e.userInfo u "
			+ " where u.username=?1")
	Employee findByUsername(String username);

	
}


