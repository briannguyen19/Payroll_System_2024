package com.microservice.account.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.account.model.Employee;
import com.microservice.account.model.LeaveRequest;
import com.microservice.account.model.Payslip;
import com.microservice.account.model.Project;
import com.microservice.account.repository.EmployeeRepository;
import com.microservice.account.repository.PayslipRepository;

@Service
public class PayslipService {

	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired
	private PayslipRepository payslipRepository;
	
	public void sendPayslipMessage(int eid, Payslip payslip) {
		Employee employee = employeeRepository.findById(eid).get();
		payslip.setEmployee(employee);
		payslipRepository.save(payslip);
	}


	public List<Payslip> PayslipsByEmployeeUsername(String username) {
		return payslipRepository.findPayslipByEmployeeUsername(username);
	}
	
	public Payslip getPayslipById(int payslipId) {
		return payslipRepository.findById(payslipId).get();
	}
	
	public Payslip postPayslip(Payslip payslip) {
		return payslipRepository.save(payslip);
	}


}