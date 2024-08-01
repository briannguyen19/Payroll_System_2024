package com.microservice.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.microservice.account.model.Payslip;
import com.microservice.account.model.Project;

public interface PayslipRepository extends JpaRepository<Payslip, Integer> {
	@Query("select p from Payslip p "
            + "join p.employee e "
            + "join e.userInfo u "
            + "where u.username = ?1")
	List<Payslip> findPayslipByEmployeeUsername(String username);

}
