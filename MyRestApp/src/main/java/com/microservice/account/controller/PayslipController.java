package com.microservice.account.controller;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.account.model.LeaveRequest;
import com.microservice.account.model.Payslip;
import com.microservice.account.model.Project;
import com.microservice.account.service.PayslipService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class PayslipController {

	@Autowired
	private PayslipService payslipService;
	@PostMapping("/api/payslip/employee/{eid}")
	public void sendPayslipMessage(@PathVariable("eid") int eid, @RequestBody Payslip payslip) {
		payslipService.sendPayslipMessage(eid,payslip);
	}
	
//	@GetMapping("/api/payslip/{eid}")
//	public List<Payslip> getAllPayslipMessage(@PathVariable("eid") int eid){
//		return payslipService.getAllPayslipMessage(eid)
//					.stream()
//					.filter(t->t.isArchived() == false)
//					.collect(Collectors.toList());
//	}
	
	@GetMapping("/api/employee/payslip/getall")
    public List<Payslip> getPayslipMessageByName(Principal principal) {
        String username = principal.getName();
        
        List<Payslip> list = payslipService.PayslipsByEmployeeUsername(username)
				.stream()
				.filter(l->l.isArchived() == false)
				.collect(Collectors.toList());
		
		return list; 
    }
	
	@GetMapping("/api/payslip/archive/{id}")
	public Payslip updateLeaveArchive(  @PathVariable("id") int id ) {
		Payslip payslip = payslipService.getPayslipById(id);
		payslip.setArchived(true);
		return payslipService.postPayslip(payslip);
	}

	
}
