package com.microservice.account.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.account.dto.ResponseDto;
import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Manager;
import com.microservice.account.model.Project;
import com.microservice.account.service.ProjectService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	
	@PostMapping("/api/project/add")
	public Project postProject(@RequestBody Project project) {
		return projectService.postProject(project); 
	}
	
	@GetMapping("/api/project/all")
	public List<Project> getAll(){
		return projectService.getAll();
	}
	
	@GetMapping("/api/employee/projects")
    public List<Project> getProjectsByEmployee(Principal principal) {
        String username = principal.getName();
        return projectService.getProjectsByEmployeeUsername(username);
    }
}
