package com.microservice.account.service;

import com.microservice.account.model.Payslip;
import com.microservice.account.model.SalaryDetail;
import com.microservice.account.repository.SalaryDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryDetailService {

    @Autowired
    private SalaryDetailRepository salaryDetailRepository;

    public SalaryDetail addSalaryDetail(SalaryDetail salaryDetail) {
        return salaryDetailRepository.save(salaryDetail);
    }

    public List<SalaryDetail> getAllSalaryDetails() {
        return salaryDetailRepository.findAll();
    }

    public SalaryDetail updateSalaryDetail(int id, SalaryDetail salaryDetail) {
        SalaryDetail existingDetail = salaryDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("SalaryDetail not found"));
        existingDetail.setBaseSalary(salaryDetail.getBaseSalary());
        existingDetail.setBonus(salaryDetail.getBonus());
        existingDetail.setStock(salaryDetail.getStock());
        existingDetail.setEffectiveDate(salaryDetail.getEffectiveDate());
        return salaryDetailRepository.save(existingDetail);
    }

	public List<SalaryDetail> SalaryDetailsByEmployeeUsername(String username) {
		return salaryDetailRepository.findSalaryDetailByEmployeeUsername(username);
	}
}
