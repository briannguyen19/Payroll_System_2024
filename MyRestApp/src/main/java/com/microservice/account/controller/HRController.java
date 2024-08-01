package com.microservice.account.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.account.dto.ManagerDto;
import com.microservice.account.enums.JobTitle;
import com.microservice.account.enums.RoleType;
import com.microservice.account.model.HR;
import com.microservice.account.model.UserInfo;
import com.microservice.account.service.HRService;
import com.microservice.account.service.UserInfoService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class HRController {

	@Autowired
	private HRService hrService; 
	@Autowired
	private UserInfoService userInfoService;
	
	
	@PostMapping("/api/hr/add")
	public HR postHR(@RequestBody HR hr) {
		hr.setJobTitle(JobTitle.HR);
		UserInfo userInfo = hr.getUserInfo();
		

		userInfo.setRole(RoleType.HR);
		userInfo = userInfoService.insertUserInfo(userInfo);
		
		hr.setUserInfo(userInfo);
		
		return hrService.insertHR(hr);
	}

	@GetMapping("/api/hr/stat")
	public Map<String,Integer> hrStats() {
		Map<String,Integer> map = hrService.getStat();
		return map; 
	}
	
	@GetMapping("/api/hr/manager/employee")
	public List<ManagerDto> getAllManagerWithEmployee() {
		List<ManagerDto> dto = hrService.getAllManagerWithEmployee();
		return dto; 
	}
}
