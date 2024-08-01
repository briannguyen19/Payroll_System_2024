package com.microservice.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.microservice.account.exception.ResourceNotFoundException;
import com.microservice.account.model.Manager;
import com.microservice.account.repository.ManagerRepository;

@Service
public class ManagerService {

	@Autowired
	private ManagerRepository managerRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public Manager insertManager(Manager manager) {
		String rawPass = manager.getUserInfo().getPassword();
		String encodedPass = passwordEncoder.encode(rawPass);
		manager.getUserInfo().setPassword(encodedPass);
		return managerRepository.save(manager);
	}

	public Manager getManagerById(int managerId) throws ResourceNotFoundException {
		Optional<Manager> optional =  managerRepository.findById(managerId);
		if(optional.isEmpty())
			throw new ResourceNotFoundException("Manager Id Invalid");
		return optional.get();
	}

	public List<Manager> getAll() {
		 
		return managerRepository.findAll();
	}

}
