import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../hr.css';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button} from 'primereact/button';

function Project() {
    const [projectTitle, setProjectTitle] = useState('');
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [manager, setManager] = useState(null);
    const [dates, setDates] = useState(null)
    const toast = useRef(null);
    
    useEffect(() => {
        axios.get('http://localhost:8081/api/employee/getall', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp => {
            setEmployees(resp.data);
        });

        axios.get('http://localhost:8081/api/project/all', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setProjects(resp.data);
        });
    }, []);

    const addProject = () => {
        if (!projectTitle || !dates[0] || !dates[1]) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Please enter the project title or project period',
                life: 3000,
            });
            return;
        }

        let startDate = new Date(dates[0]).toISOString().split("T")[0];
        let endDate = new Date(dates[1]).toISOString().split("T")[0];

        

        let data = {
            title: projectTitle,
            'startDate' : startDate,
            'endDate' : endDate
        };



        axios.post('http://localhost:8081/api/project/add', data, {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'New Project Added Successfully',
                life: 3000,
            });
            setProjectTitle('');
            setProjects([...projects, resp.data]);
            setDates(null)
        }).catch(err => {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There are some error, Please contact admin',
                life: 3000,
            });
            return;
        });

        window.scroll(0, 0);
    };

    const assignProjectToEmployee = () => {
        if (!employeeId || !projectId) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Please choose employee name or Project',
                life: 3000,
            });
            return;
        }

        axios.post(`http://localhost:8081/api/employee/project/assign/${employeeId}/${projectId}`, {}, {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Project is assigned successfully',
                life: 3000,
            });
            return;
            
        }).catch(err => {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There is some error Please contact Admin',
                life: 3000,
            });
        });

        window.scroll(0, 0);
    };

    const handleEmployeeChange = (e) => {
        const employeeId = e.target.value;
        setEmployeeId(employeeId);

        const selectedEmployee = employees.find(emp => emp.id === parseInt(employeeId));
        if (selectedEmployee) {
            setManager(selectedEmployee.manager);
        } else {
            setManager(null);
        }
    };

    return (
        <div>
            <div className="container mt-4" style={{ width: '70%', height: "100%" }}>
                <div className="row">
                    <div className="col-lg-12">
                        <div  className="card flex justify-content-center">
                            <div className="card-body employee-form"> 
                            {/* <Card style={{left:'70px', position:'relative', border:'1px solid'}}> */}
                                {/* {msg && <div className="alert alert-primary" role="alert">{msg}</div>} */}
                                <div className="mb-3">
                                    <label className="form-label">Enter Project Title:     </label>
                                    <InputText
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter project title"
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                    />
                                    <br /> 
                                    <label className="form-label">Enter Project Period:     </label>
                                    <Calendar
                                        value={dates}
                                        onChange={(e) => setDates(e.value)}
                                        selectionMode="range"
                                        readOnlyInput
                                        hideOnRangeSelection
                                    />

                                </div>
                                <Toast ref={toast} />
                                <div className="flex flex-wrap gap-2">
                                    <Button label="Add Project" severity="info" onClick={addProject} style={{marginBottom:'30px', borderRadius:'18px', fontSize:'12px'}} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Select Project: </label>

                                    <select className="form-select" aria-label="Default select example"
                                        value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                                            <option value="">Select Project</option>
                                            {projects.map((p, index) => (
                                                <option value={p.id} key={index}>{p.title}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Select Employee to assign to this project: </label>
                                    <select className="form-select" aria-label="Default select example"
                                        value={employeeId} onChange={handleEmployeeChange}>
                                            <option value="">Select Employee</option>
                                            {employees.map((e, index) => (
                                                <option value={e.id} key={index}>{e.name}</option>
                                            ))}
                                    </select>
                                </div>
                                {manager && (
                                    <div className="mb-4">
                                        <label className="form-label">Manager is assigned to this project: </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={manager.name}
                                            readOnly
                                        />
                                    </div>
                                )}
                                <div className="mb-4">
                                    <Toast ref={toast} />
                                    <div className="flex flex-wrap gap-2">
                                        <Button label="Assign Project" severity="info" onClick={assignProjectToEmployee} style={{marginBottom:'30px', borderRadius:'18px', fontSize:'12px'}} />
                                    </div>
                                </div>
                             </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;
