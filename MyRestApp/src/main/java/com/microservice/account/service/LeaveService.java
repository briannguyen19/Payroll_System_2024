package com.microservice.account.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.account.enums.LeaveStatus;
import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Employee;
import com.microservice.account.model.LeaveRequest;
import com.microservice.account.repository.EmployeeRepository;
import com.microservice.account.repository.LeaveRepository;

@Service
public class LeaveService {
	
	@Autowired
	private LeaveRepository LeaveRepository;
	
	public LeaveRequest submitLeaveRequest(LeaveRequest leave) {
		return LeaveRepository.save(leave);
	}

	public LeaveRequest approveLeaveRequest(int id, String name) throws ResourceNotFoundException {
		LeaveRequest leaveRequest = LeaveRepository.findPendingLeaveRequestByIdUsingManagerName(id, name);
		if (leaveRequest == null) {
			throw new ResourceNotFoundException("Leave Request not found");
		}
		leaveRequest.setLeaveStatus(LeaveStatus.APPROVED);
		return LeaveRepository.save(leaveRequest);
	}

	public LeaveRequest rejectLeaveRequest(int id, String name) throws ResourceNotFoundException {
		LeaveRequest leaveRequest = LeaveRepository.findPendingLeaveRequestByIdUsingManagerName(id, name);
		if (leaveRequest == null) {
			throw new ResourceNotFoundException("Leave Request not found");
		}
		leaveRequest.setLeaveStatus(LeaveStatus.REJECTED);
		return LeaveRepository.save(leaveRequest);
	}

	public List<LeaveRequest> getAllLeaveRquestByEmployeeUsername(String username) {
		return LeaveRepository.findAllLeaveRequestsByEmployeeUsername(username);
	}

	public Map<String, Integer> getStat(String username) {
		int countPendingLeaveRequest =  LeaveRepository.findAllPendingLeaveRequestsByEmployeeUsername(username).size();
		int countApprovedLeaveRequest = LeaveRepository.findAllApprovedLeaveRequestsByEmployeeUsername(username).size();
		int countRejectedLeaveRequest = LeaveRepository.findAllRejectedLeaveRequestsByEmployeeUsername(username).size();
		Map<String, Integer> map = new HashMap<>();
		map.put("Approved", countApprovedLeaveRequest);
		map.put("Rejected", countRejectedLeaveRequest);
		map.put("Pending", countPendingLeaveRequest);
		return map;
	}

	public LeaveRequest getLeave(int leaveId) {
		return LeaveRepository.findById(leaveId).get();
	}

	public List<LeaveRequest> findLeaveRequestByEmployeeId(int eid) {
		return LeaveRepository.findLeaveRequestByEmployeeId(eid);
	}

}
