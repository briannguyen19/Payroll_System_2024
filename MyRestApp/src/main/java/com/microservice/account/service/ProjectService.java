package com.microservice.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Manager;
import com.microservice.account.model.Project;
import com.microservice.account.repository.ProjectRepository;

@Service
public class ProjectService {

	@Autowired
	private ProjectRepository projectRepository;
	
	public Project getProjectById(int projectId) throws ResourceNotFoundException {
		Optional<Project> optional = projectRepository.findById(projectId);
		if(optional.isEmpty())
			throw new ResourceNotFoundException("Project Id Invalid...");
		return optional.get();
	}

	public Project postProject(Project project) {
		return projectRepository.save(project);
	}

	public List<Project> getAll() {
		return projectRepository.findAll();
	}

	public List<Project> getProjectsByEmployeeUsername(String username) {
		return projectRepository.findProjectsByEmployeeUsername(username);
	}

}
