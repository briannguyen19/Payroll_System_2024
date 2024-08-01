package com.microservice.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.microservice.account.model.LeaveRequest;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Integer> {
	
	@Query(nativeQuery = true, 
			value = "select lr.* from leave_request lr "
				  + "join employee e on lr.employee_id = e.id "
				  + "join manager m on e.manager_id = m.id "
				  + "join user_info u on m.user_info_id = u.id "
				  + "where lr.leave_status = 'PENDING' and lr.id = ?1 and u.username = ?2")
	LeaveRequest findPendingLeaveRequestByIdUsingManagerName(int id, String username);
	
	@Query(nativeQuery = true, 
			value = "select lr.* from leave_request lr "
				  + "join employee e on lr.employee_id = e.id "
				  + "join user_info u on e.user_info_id = u.id "
				  + "where u.username = ?1")
	List<LeaveRequest> findAllLeaveRequestsByEmployeeUsername(String username);
	
	@Query(nativeQuery = true, 
			value = "select lr.* from leave_request lr "
				  + "join employee e on lr.employee_id = e.id "
				  + "join user_info u on e.user_info_id = u.id "
				  + "where u.username = ?1 and lr.leave_status = 'PENDING'")
	List<LeaveRequest> findAllPendingLeaveRequestsByEmployeeUsername(String username);
	
	@Query(nativeQuery = true, 
			value = "select lr.* from leave_request lr "
				  + "join employee e on lr.employee_id = e.id "
				  + "join user_info u on e.user_info_id = u.id "
				  + "where u.username = ?1 and lr.leave_status = 'APPROVED'")
	List<LeaveRequest> findAllApprovedLeaveRequestsByEmployeeUsername(String username);
	
	@Query(nativeQuery = true, 
			value = "select lr.* from leave_request lr "
				  + "join employee e on lr.employee_id = e.id "
				  + "join user_info u on e.user_info_id = u.id "
				  + "where u.username = ?1 and lr.leave_status = 'REJECTED'")
	List<LeaveRequest> findAllRejectedLeaveRequestsByEmployeeUsername(String username);

	List<LeaveRequest> findLeaveRequestByEmployeeId(int eid);
	
}
