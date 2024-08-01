package com.microservice.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.microservice.account.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Integer>{
	
	@Query("select p from Project p "
            + "join EmployeeProject ep on p.id = ep.project.id "
            + "join ep.employee e "
            + "join e.userInfo u "
            + "where u.username = ?1")
	List<Project> findProjectsByEmployeeUsername(String username);

}
