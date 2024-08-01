package com.microservice.account.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.account.model.EmployeeProject;
import com.microservice.account.repository.EmployeeProjectRepository;

@Service
public class EmployeeProjectService {

	@Autowired
	private EmployeeProjectRepository employeeProjectRepository;
	
	public EmployeeProject postEmployeeProject(EmployeeProject emp) {
		 return employeeProjectRepository.save(emp);
	}

}
