package com.microservice.account.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.account.dto.ResponseDto;
import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Employee;
import com.microservice.account.model.Payslip;
import com.microservice.account.model.SalaryDetail;
import com.microservice.account.service.EmployeeService;
import com.microservice.account.service.SalaryDetailService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})

public class SalaryDetailController {
	 	 @Autowired
	     private SalaryDetailService salaryDetailService;
	 	 
	 	 @Autowired
	 	 private EmployeeService employeeService;
	 	 
	 	 @PostMapping("/api/salary-detail/add/{employeeId}")
	     public ResponseEntity<?> addSalaryDetail(@PathVariable int employeeId, @RequestBody SalaryDetail salaryDetail) {
	 		 Employee employee;
			 try {
				employee = employeeService.getEmployeeById(employeeId);
			 } catch (ResourceNotFoundException e) {
				 return ResponseEntity
						 .badRequest()
						 .body(new ResponseDto(e.getMessage(), "400"));
			 }
	         salaryDetail.setEmployee(employee);
	         SalaryDetail createdDetail = salaryDetailService.addSalaryDetail(salaryDetail);
	         
	         double totalSalary = salaryDetail.getBaseSalary() + salaryDetail.getBonus() + salaryDetail.getStock();
	         employee.setSalary(totalSalary);
	         employeeService.updateEmployee(employee);
	         
	         return ResponseEntity.ok(createdDetail);
	     }

	    @GetMapping("api/salary-detail/getall")
	    public ResponseEntity<?> getAllSalaryDetails() {
	        List<SalaryDetail> details = salaryDetailService.getAllSalaryDetails();
	        return ResponseEntity.ok(details);
	    }

	    @PutMapping("api/salary-detail/update/{id}")
	    public ResponseEntity<SalaryDetail> updateSalaryDetail(@PathVariable int id, @RequestBody SalaryDetail salaryDetail) {
	        SalaryDetail updatedDetail = salaryDetailService.updateSalaryDetail(id, salaryDetail);
	        return ResponseEntity.ok(updatedDetail);
	    }
	    
	    @GetMapping("/api/employee/salary-details")
	    public List<SalaryDetail> getPayslipMessageByName(Principal principal) {
	        String username = principal.getName();
	        return salaryDetailService.SalaryDetailsByEmployeeUsername(username);
	    }
}
