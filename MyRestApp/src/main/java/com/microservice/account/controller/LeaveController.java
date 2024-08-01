package com.microservice.account.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

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
import com.microservice.account.enums.JobTitle;
import com.microservice.account.enums.LeaveStatus;
import com.microservice.account.enums.RoleType;
import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Employee;
import com.microservice.account.model.LeaveRequest;
import com.microservice.account.model.Manager;
import com.microservice.account.model.UserInfo;
import com.microservice.account.service.EmployeeService;
import com.microservice.account.service.LeaveService;
import com.microservice.account.service.ManagerService;
import com.microservice.account.service.UserInfoService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class LeaveController {
	
	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private LeaveService leaveService; 
	
	@PostMapping("/api/leave/submit")
	public LeaveRequest submit(@RequestBody LeaveRequest leave, Principal principal) {
		String username = principal.getName();
		Employee employee = employeeService.getEmployeeByUsername(username);
			
		leave.setEmployee(employee);
		leave.setLeaveStatus(LeaveStatus.PENDING);
		leave = leaveService.submitLeaveRequest(leave);
		return leave;
	}
	
	@PutMapping("/api/leave/approve/{id}")
	public LeaveRequest approveRequest(@PathVariable int id, Principal principal) throws ResourceNotFoundException {
		return leaveService.approveLeaveRequest(id, principal.getName());
	}
	
	@PutMapping("/api/leave/reject/{id}")
	public LeaveRequest rejectRequest(@PathVariable int id, Principal principal) throws ResourceNotFoundException {
		return leaveService.rejectLeaveRequest(id, principal.getName());
	}
	
	@GetMapping("/api/leave/employee/getall")
	public List<LeaveRequest> getAllLeaveRquestByEmployeeUsername(Principal principal) {
		String username = principal.getName();
		
		List<LeaveRequest> list = leaveService.getAllLeaveRquestByEmployeeUsername(username)
				.stream()
				.filter(l->l.isArchive() == false)
				.collect(Collectors.toList());
		
		return list; 
	}
	
	@GetMapping("/api/leave/employee/stat")
	public Map<String,Integer> LeaveStats(Principal principal) {
		String username = principal.getName();
		Map<String,Integer> map = leaveService.getStat(username);
		return map; 
	}
	
	@GetMapping("/api/leave/archive/{leaveId}")
	public LeaveRequest updateLeaveArchive(  @PathVariable("leaveId") int leaveId ) {
		LeaveRequest leave = leaveService.getLeave(leaveId);
		leave.setArchive(true);
		return leaveService.submitLeaveRequest(leave);
	}
	
	@GetMapping("/api/leave/employee/{eid}")
	public List<LeaveRequest> getAllLeaveRquestByEmployeeUsername(@PathVariable("eid") int eid) {
		List<LeaveRequest> list = leaveService.findLeaveRequestByEmployeeId(eid);
		return list; 
	}
}
