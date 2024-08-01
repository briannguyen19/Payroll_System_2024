package com.microservice.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.microservice.account.model.SalaryDetail;

public interface SalaryDetailRepository extends JpaRepository<SalaryDetail, Integer> {
	
	@Query("select sd from SalaryDetail sd "
            + "join sd.employee e "
            + "join e.userInfo u "
            + "where u.username = ?1")
	List<SalaryDetail> findSalaryDetailByEmployeeUsername(String username);

}
