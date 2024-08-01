import { useEffect, useState, useRef } from "react";
import React from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext'; 
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from 'primereact/calendar';
import Navbar from "./navbar";
import axios from "axios";

import EmployeeOnBoarding from "./employeeonboarding";
import Project from "./project";
import SalaryDetail from "./salarydetail";
import { getEmployees } from "../../../store/action/employee";
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import { Tag } from 'primereact/tag';

function EmployeeList(){
    const list = useSelector((state)=>state.employee)
    const [data,setData] = useState([]);
    const dispatch = useDispatch()
    const [visibleSendPayslipMessage, setVisibleSendPayslipMessage] = useState(false);
    const [visibleProject, setVisibleProject] = useState(false);
    const [visibleAddSalaryDetails, setVisibleAddSalaryDetails] = useState(false);
    const [visibleAddEmployee, setVisibleAddEmployee] = useState(false);
    const [loading,setLoading] = useState(true);
    const [employee,setEmployee] = useState({});
    const [employeeId, setEmployeeId] = useState(null);
    const [dates, setDates] = useState(null);
    const [payslipMessage,setPayslipMessage] = useState('');
    const [visibleLeaveRequest, setVisibleLeaveRequest] = useState(null);
    const [leaveStatus, setLeaveStatus] = useState(null);
    const toast = useRef(null);
    
    const getSeverity = (status) => {
      switch (status) {
          case 'REJECTED':
              return 'danger';

          case 'APPROVED':
              return 'success';

          case 'PENDING':
              return 'warning';
      }
   };

    useEffect(()=>{
        async function fetchEmployee() {
            await dispatch(getEmployees());  
            setData(list)
            setLoading(false)
        }

        if(list.length === 0){
            fetchEmployee();
        }else {
            setData(list)
            setLoading(false)
        }

    },[list]); 

    const LeaveRequestRetrieve=(leaveId)=>{
      axios.get('http://localhost:8081/api/leave/employee/' + leaveId,{
          headers: {
              'Authorization': 'Basic ' + localStorage.getItem('token')
          }
      })
      .then(resp=>{
          setLeaveStatus(resp.data);
      })
      .catch(err=>{})
  }
    
    const sendPayslipmessage = ()=> {
        if (!dates[0] || !dates[1] || !payslipMessage ) {
            toast.current.show({
              severity: 'info',
              summary: 'Info',
              detail: 'There is some missing information, please check again',
              life: 3000,
              });
            return;
        }
        let startDate = new Date(dates[0]).toISOString().split("T")[0];
        let endDate = new Date(dates[1]).toISOString().split("T")[0];
        let empId = employee.id; 
        let data = {
            'payslipMessage': payslipMessage,
            'startDate': startDate,
            'endDate': endDate  
        }

        axios.post('http://localhost:8081/api/payslip/employee/' + empId,
            data,
            {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        }) .then(resp=>{
            toast.current.show({
              severity: 'success',
              summary: 'Success',
              detail: "Payslip Message sent to " + employee.name + " successfully.",
              life: 3000,
            });
            setPayslipMessage(null)
            setDates(null)
            return;
        
         })
        .catch(err=>{
            toast.current.show({
              severity: 'error',
              summary: 'Error',
              detail: "Operation Failed, pls contack Admin",
              life: 3000,
            });
        })
    }

    const globalSearch = (val)=>{
        if(!val)
            setData(list)
        else{
            let temp = list.filter(row=> row.name.toLowerCase().search(val) !== -1);
            setData(temp)
        }
         
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText   onChange={(e)=>globalSearch(e.target.value)} placeholder="Keyword Search" />
                </IconField> 

                <Button 
                  label='Employee' 
                  icon='pi pi-plus' 
                  style={{position: 'absolute', left: "50px", top: "15px", backgroundColor: '#0B1941', color: 'white'}}
                  onClick={() => {
                    setVisibleAddEmployee(true)
                    }}>
                </Button>

                <Button 
                  className="project icon"
                  label='Project' 
                  style={{position: 'absolute', width: '150px', left: "200px", top: "15px", backgroundColor: '#0B1941', color: 'white'}} 
                  onClick={() => {
                    setVisibleProject(true)
                    }} > 
                </Button>
            </div>
        );
    };

    const header = renderHeader();

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-10" style={{position:"relative", left: "-80px"}}>
                <Button className="btn btn-primary" onClick={()=>{
                    setEmployee(rowData)
                    setVisibleAddSalaryDetails(true);
                }}> Add Salary Details
                </Button>
                &nbsp;&nbsp;
                <Button className="btn btn-warning" onClick={() => {
                    setEmployee(rowData)
                    setVisibleSendPayslipMessage(true)
                    }}> 
                    Send Payslip Message
                </Button>
            </div>
        );
    };

    const LeaveRequestBodyTemplate = (rowData) => {
      console.log("DEBUGGING", rowData.id)
      return (
          <div className="flex align-items-center gap-10" style={{position:"relative", left: "-80px"}}>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <Button className="btn btn-success" onClick={() => {
                    setEmployee(rowData)
                    setVisibleLeaveRequest(true)
                    LeaveRequestRetrieve(rowData.id)
                    }}> 
                    Check Leave Requests
                </Button>
          </div>
      );
    };

    const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">
        Send Message to {employee?.name}
      </span>
    </div>
    );

    const addSalaryDetailsHeaderElement = (
      <div className="inline-flex align-items-center justify-content-center gap-2">
        <span className="font-bold white-space-nowrap">
          Salary Detais of {employee?.name}
        </span>
      </div>
    );

    const checkLeaveRequestHeaderElement = (
      <div className="inline-flex align-items-center justify-content-center gap-2">
        <span className="font-bold white-space-nowrap">
          Leave Requests of {employee?.name}
        </span>
      </div>
    );


    const addEmployeeHeaderElement = (
      <div className="inline-flex align-items-center justify-content-center gap-2">
        <span className="font-bold white-space-nowrap">
          Add New Employee
        </span>
      </div>
    );

    const addProjectHeaderElement = (
      <div className="inline-flex align-items-center justify-content-center gap-2">
        <span className="font-bold white-space-nowrap">
          Add and Assign Project to Employee and Manager
        </span>
      </div>
    );

    const footerContent = (
        <div>
            <Toast ref={toast} />
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-warning " style={{position:'absolute', right: '120px', width:'80px', height:'40px'}} onClick={() => sendPayslipmessage()}> Send</button>
            </div>
            <button className="btn btn-danger" onClick={() => {setVisibleSendPayslipMessage(false);setVisibleAddSalaryDetails(false); setVisibleAddEmployee(false); setVisibleProject(false)}}> Cancel</button>

        </div>
    );

    const footerWithOnlyCancelContent = (
        <div>
            <button className="btn btn-danger" onClick={() => {setVisibleSendPayslipMessage(false); setVisibleAddSalaryDetails(false); setVisibleAddEmployee(false); setVisibleProject(false); setVisibleLeaveRequest(false)}}> Cancel</button>
        </div>
    );

    const statusBodyTemplate = (employeeLeaveRequest) => {
      return <Tag value={employeeLeaveRequest.leaveStatus} severity={getSeverity(employeeLeaveRequest.leaveStatus)} />;
    };
    return (
      <div className="card">
       <Navbar/>
       <DataTable
          value={data}
          paginator
          rows={6}
          dataKey="id"
          // filters={filters}
          filterDisplay="row"
          loading={loading}
          header={header}
          emptyMessage="No employees found."
        >
            <Column field="id" header="ID" style={{ minWidth: "8rem" }} />
            <Column
              field="name"
              header="Name"
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="city"
              header="City"
              style={{ minWidth: "8rem" }}
            />
            <Column field="salary" header="Salary" style={{ minWidth: "8rem" }} />
            <Column 
              field="jobTitle"
              header="Job Title"
              style={{ minWidth: "12rem" }}
            />
            <Column header="Salary Details & Payslip" body={actionBodyTemplate} />
            <Column header="Leave Request" body={LeaveRequestBodyTemplate} />
        </DataTable>
           

        <Dialog
          visible={visibleSendPayslipMessage}
          modal
          header={headerElement}
          footer={footerContent}
          style={{ width: "50rem" }}
          onHide={() => {
            if (!visibleSendPayslipMessage) return;
            setVisibleSendPayslipMessage(false);
          }}
        >
          <p className="m-0">
            <div>
              <FloatLabel>
                <InputTextarea
                  id="description"
                  onChange={(e) => {
                    setPayslipMessage(e.target.value);
                  }}
                  rows={5}
                  cols={88}
                />
                <label htmlFor="description">Enter Message Here!</label>
              </FloatLabel>
            </div>
            <label>Enter Payslip Period: </label>
            <br />
            <div className="card flex justify-content-center">
              <Calendar
                value={dates}
                onChange={(e) => setDates(e.value)}
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
              />
            </div>
          </p>
        </Dialog>
       <Dialog 
            visible= {visibleAddSalaryDetails}
            modal 
            header = {addSalaryDetailsHeaderElement}
            footer = {footerWithOnlyCancelContent}
            style={{ width: "50rem" }}
            onHide={() => {
                if (!visibleAddSalaryDetails) return;
                setVisibleAddSalaryDetails(false);
            }}
       >
            <SalaryDetail employeeId = {employee?.id} onSalaryDetailAdded={() => dispatch(getEmployees())}/>
       </Dialog>
       <Dialog 
            visible= {visibleAddEmployee}
            modal 
            header = {addEmployeeHeaderElement}
            footer = {footerWithOnlyCancelContent}
            style={{ width: "50rem" }}
            onHide={() => {
                if (!visibleAddEmployee) return;
                setVisibleAddEmployee(false);
            }}
       >
            <EmployeeOnBoarding />
       </Dialog>
       <Dialog 
            visible= {visibleProject}
            modal 
            header = {addProjectHeaderElement}
            footer = {footerWithOnlyCancelContent}
            style={{ width: "40rem" }}
            onHide={() => {
                if (!visibleProject) return;
                setVisibleProject(false);
            }}
       >
            <Project />
       </Dialog>
       <Dialog 
            visible= {visibleLeaveRequest}
            modal 
            header = {checkLeaveRequestHeaderElement}
            footer = {footerWithOnlyCancelContent}
            style={{ width: "40rem" }}
            onHide={() => {
                if (!visibleLeaveRequest) return;
                setVisibleLeaveRequest(false);
            }}
       >
        <DataTable
                  value={leaveStatus}
                  paginator
                  rows={4}
                  style = {{marginTop : "120px"}}
                  dataKey="id"
                  emptyMessage="No Leave Request found.">
                  <Column filter field="id" header="ID" style={{ minWidth: "8rem" }} />
                  <Column
                      field="reason"
                      header="Reason"
                      style={{ minWidth: "8rem" }}
                      filter
                  /> 
                  <Column
                      field="startDate"
                      header="From"
                      style={{ minWidth: "8rem" }}
                      dataType="date"
                      filter
                  />
                  <Column filter dataType="date" field="endDate" header="To" style={{ minWidth: "8rem" }} />
                  <Column
                      filter
                      field="leaveStatus"
                      header="Status"
                      style={{ minWidth: "12rem" }}
                      body = {statusBodyTemplate}
                  /> 
              </DataTable>
       </Dialog>
      </div>
    );
}

export default EmployeeList;