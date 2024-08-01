package com.microservice.account.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;import org.springframework.transaction.jta.JtaAfterCompletionSynchronization;
import org.springframework.web.bind.annotation.GetMapping;

import com.microservice.account.enums.JobTitle;
import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Employee;
import com.microservice.account.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired 
	private PasswordEncoder passwordEncoder; 
	
	public Employee addEmployee(Employee employee) {
		String rawPass = employee.getUserInfo().getPassword();
		String encodedPass = passwordEncoder.encode(rawPass);
		employee.getUserInfo().setPassword(encodedPass);
		return employeeRepository.save(employee);
	}

	public List<Employee> getAllEmployee() {
		return employeeRepository.findAll();
	}

	public void deleteEmployee(int id) {
		employeeRepository.deleteById(id);
		
	}

	
	public Employee getEmployeeById(int id) throws ResourceNotFoundException {
		Optional<Employee> optional =  employeeRepository.findById(id);
		if(optional.isEmpty()) {
			throw new ResourceNotFoundException("Invalid Employee Id Given");
		}
		return optional.get();
	}

	public List<String> getAllJobType() {
		JobTitle[] titles = JobTitle.values();
		List<JobTitle> list = Arrays.asList(titles);
		List<String> listStr = new ArrayList<>();
		list.stream().forEach(jt->{
			listStr.add(jt.toString());
		});
		return listStr;
	}

	public Employee updateEmployee(Employee employee) {
		return employeeRepository.save(employee);
	}
	
	public Employee getEmployeeByUsername(String username ) {
		return employeeRepository.findByUsername(username);
	}

}

/* TO qualify for autowiring, EmployeeService must be a bean. 
 * so give annotation @Service  
 */