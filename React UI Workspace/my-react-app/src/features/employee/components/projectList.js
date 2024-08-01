
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeProjects } from '../../../store/action/project';
import Navbar from './navbar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Dialog } from "primereact/dialog";
import { DataTable } from 'primereact/datatable';
import 'primeicons/primeicons.css';
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';  
import axios from "axios";


function Employee() {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.project.projects);
    const [data,setData] = useState([]);
    const [salaryDetailData, setSalaryDetailData] = useState([]);
    const [visibleAddLeaveRequest, setVisibleAddLeaveRequest] = useState(false);
    const [msg,setMsg] = useState(null);
    const [reason, setReason] = useState(false);
    const [dates, setDates] = useState(false);
    const [employeeLeaveRequest, setEmployeeLeaveRequest] = useState([]); 
    const [countPendingLeaveRequest,setCountPendingLeaveRequest] = useState(0);
    const [countApprovedLeaveRequest,setCountApprovedLeaveRequest] = useState(0);
    const [countRejectedLeaveRequest, setCountRejectedLeaveRequest] = useState(0);
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

    
    useEffect(() => {
        dispatch(getEmployeeProjects());
    }, [dispatch]);

   
    useEffect(()=>{
        axios.get('http://localhost:8081/api/employee/payslip/getall', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
 
            setData(resp.data)
        })
        .catch(error=>{

        })

        axios.get('http://localhost:8081/api/employee/salary-details', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            // console.log("DEBUG", resp.data);
            setSalaryDetailData(resp.data)
        })
        .catch(error=>{
            
        })

        axios.get('http://localhost:8081/api/leave/employee/getall', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            console.log("DEBUG", resp.data);
            setEmployeeLeaveRequest(resp.data)
        })
        .catch(error=>{
            
        })

        axios.get('http://localhost:8081/api/leave/employee/stat', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            setCountPendingLeaveRequest(resp.data.Pending)
            setCountApprovedLeaveRequest(resp.data.Approved)
            setCountRejectedLeaveRequest(resp.data.Rejected)
        })
        .catch(error=>{
            
        })
    },[])

    const showDialog = () => {
        setVisibleAddLeaveRequest(true);
    }

    const hideDialog = () => {
        setVisibleAddLeaveRequest(false);
    }

    const sumitLeaveRequest = ()=>{
        if (!dates[0] || !dates[1] || !reason) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'There is some information is missing, Please check again',
                life: 3000,
            });
            return;
        }
        let startDate = new Date(dates[0]).toISOString().split("T")[0];
        let endDate = new Date(dates[1]).toISOString().split("T")[0];
        let data1 = {
            'reason': reason,
            'startDate': startDate,
            'endDate': endDate  
        }

        axios.post('http://localhost:8081/api/leave/submit', data1,  {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            // setMsg("Leave Request is submitted successfully.")
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Leave Request is submitted successfully.',
                life: 3000,
            });
            setReason(null)
            setDates(null)
        })
        .catch(err=>{
            // setMsg("Operation Failed, pls contack Admin")
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Operation Failed, pls contack Admin',
                life: 3000,
            });
        })
    }

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
          <span className="font-bold white-space-nowrap">
            Leave Form 
              </span>
              {msg === null ? (
              ""
              ) : (
              <div class="alert alert-warning" role="alert">
                  {msg}
              </div>
              )}
        </div>
    );
    
    const footerContent = (
        <div>
            <button className="btn btn-warning " onClick={() => {sumitLeaveRequest()}} > Send</button>
            &nbsp;&nbsp;&nbsp;
            <button className="btn btn-danger " onClick={() => {setVisibleAddLeaveRequest(false)}}> Cancel</button>

        </div>
    );

    const statusBodyTemplate = (employeeLeaveRequest) => {
        return <Tag value={employeeLeaveRequest.leaveStatus} severity={getSeverity(employeeLeaveRequest.leaveStatus)} />;
    };

    const archiveLeaveRequest=(leaveId)=>{
        axios.get('http://localhost:8081/api/leave/archive/' + leaveId,{
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            setEmployeeLeaveRequest([...employeeLeaveRequest.filter(l=>l.id !== leaveId)]);
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Leave Archived',
                life: 3000,
            });
        })
        .catch(err=>{
            // setMsg('Operation Failed, Contact admin')
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Operation Failed, Contact admin',
                life: 3000,
            });
        })
    }

    const archivePayslip=(payslipId)=>{
        axios.get('http://localhost:8081/api/payslip/archive/' + payslipId,{
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            setData([...data.filter(p=>p.id !== payslipId)]);
            // setMsg('Leave Archived')
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Payslip Archived',
                life: 3000,
            });
        })
        .catch(err=>{
            // setMsg('Operation Failed, Contact admin')
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Operation Failed, Contact admin',
                life: 3000,
            });
        })
    }

    const archiveBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-10" style={{position:"relative", left: "-80px"}}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Toast ref={toast} />
                <div className="flex flex-wrap gap-2">
                    <button className="btn btn-danger" onClick={() => archiveLeaveRequest(rowData.id)}> archive</button>
                </div>
            </div>
        );
    };

    const archivePayslipTemplate = (rowData) => {
        return (
          
            <div className="flex align-items-center gap-10" style={{position:"relative", left: "-80px"}}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Toast ref={toast} />
                <button className="btn btn-danger" onClick={() => archivePayslip(rowData.id)}> archive
                </button>
            </div>
        );
    };
    

    return (
        <div >
            <Navbar />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Toast ref={toast} />
            <Button 
                label='Leave Request' 
                icon='pi pi-plus' 
                style={{position: 'absolute', right: "100px", top: "110px", backgroundColor: '#0B1941', color: 'white'}} 
                onClick={showDialog}>   
                
            </Button>

            <Dialog
                visible={visibleAddLeaveRequest}
                modal
                header={headerElement}
                footer={footerContent}
                style={{ width: "50rem" }}
                onHide={() => {
                    if (!visibleAddLeaveRequest) return;
                    setVisibleAddLeaveRequest(false);
                }}
                >
                <p className="m-0">
                    <div>
                    <FloatLabel>
                        <InputTextarea
                        id="description"
                        onChange={(e) => {
                            setReason(e.target.value);
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
            <TabView className="prime" style={{marginTop: '50px', color: 'red'}}>
                <TabPanel  header="Employee Projects">
                    <div style={{  width: '100%' }}>
                        <div className="p-card">
                            <DataTable
                                value={projects}
                                paginator
                                rows={2}
                                style = {{marginTop : "30px"}}
                                dataKey="id"
                                emptyMessage="No projects found."
                            >
                                <Column filter field="id" header="ID" style={{ minWidth: "8rem" }} />
                                <Column
                                    field="title"
                                    header="Project Name"
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
                            </DataTable>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Payslip Message">
                    <div className="container mt-4" style={{ width: '100%' }}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="p-card">
                                        <DataTable
                                            value={data}
                                            paginator
                                            rows={2}
                                            style = {{marginTop : "30px"}}
                                            dataKey="id"
                                            emptyMessage="No Payslip found."
                                        >
                                            <Column filter field="id" header="ID" style={{ minWidth: "8rem" }} />
                                            <Column
                                                field="payslipMessage"
                                                header="Payslip Message"
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
                                                header="Archive Payslip"
                                                style={{ minWidth: "12rem" }}
                                                body = {archivePayslipTemplate}
                                            
                                            /> 
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                </TabPanel>
                <TabPanel header="Salary Details">
                <div className="container mt-4" style={{ width: '100%' }}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="p-card">
                                        {/* <div className="card-header">
                                            <h4>Employee Salary Details</h4>
                                        </div>
                                        <div className="card-body employee-form">
                                            <ul>
                                                {salaryDetailData.map((sd) => (
                                                    <li key={sd[0]}>{sd.baseSalary} ---- {sd.stock}----- {sd.bonus} since {sd.effectiveDate}</li>
                                                ))}
                                            </ul>
                                        </div> */}
                                        <DataTable
                                            value={salaryDetailData}
                                            paginator
                                            rows={2}
                                            style = {{marginTop : "30px"}}
                                            dataKey="id"
                                            emptyMessage="No projects found."
                                        >
                                            <Column filter field="id" header="ID" style={{ minWidth: "8rem" }} />
                                            <Column
                                                field="baseSalary"
                                                header="Base Salary"
                                                style={{ minWidth: "8rem" }}
                                                filter
                                            /> 
                                            <Column
                                                field="stock"
                                                header="Stock"
                                                style={{ minWidth: "8rem" }}
                                                filter
                                            />
                                            
                                            <Column
                                                filter
                                                header="Bonus"
                                                field="bonus"
                                                style={{ minWidth: "12rem" }}                                            
                                            />
                                            <Column filter dataType="date" field="effectiveDate" header="Effective Date" style={{ minWidth: "8rem" }} /> 
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        </div>
                </TabPanel>
                <TabPanel header="Leave Request Status">
                    <Card title="Rejected" style={{width: '220px', top:'270px', right :'160px', position: 'absolute', backgroundColor: "red"}}>
                        <i className="pi pi-file" style={{ fontSize: '5rem' }}></i>
                        <span style = {{position: 'absolute', bottom: '10px', right: '20px', fontSize: '80px'}}>{countRejectedLeaveRequest}</span>
                    </Card>
                    <Card title="Pending" style={{width: '220px', top:'270px', right :'500px', position: 'absolute', backgroundColor: "#FFD700"}}>
                        <i className="pi pi-file-edit" style={{ fontSize: '5rem' }}></i>
                        <span style = {{position: 'absolute', bottom: '10px', right: '20px', fontSize: '80px'}}>{countPendingLeaveRequest}</span>
                    </Card>
                    <Card title="Approved" style={{width: '220px', top:'270px', right :'840px', position: 'absolute', backgroundColor: "green"}}>
                        <i className="pi pi-file-check" style={{ fontSize: '5rem' }}></i>
                        <span style = {{position: 'absolute', bottom: '10px', right: '20px', fontSize: '80px'}}>{countApprovedLeaveRequest}</span>
                    </Card>
                    <br />
                    <DataTable
                        value={employeeLeaveRequest}
                        paginator
                        rows={2}
                        style = {{marginTop : "300px"}}
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
                        <Column
                            filter
                            header="Archive Leave Request"
                            style={{ minWidth: "12rem" }}
                            body = {archiveBodyTemplate}
                        
                        /> 
                        {/* <Column header="Action">
                            {" "}
                        </Column> */}
                    </DataTable>
                </TabPanel>
            </TabView>
        </div>
    );
}

export default Employee;

 