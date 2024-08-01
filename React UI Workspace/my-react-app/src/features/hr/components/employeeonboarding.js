import '../hr.css'
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

function EmployeeOnBoarding(){
    const [jobTitle, setJobTitle] = useState([])
    const [managers,setManagers] = useState([])

    const [name,setName] = useState(null);
    const [city,setCity] = useState(null);
    const [salary,setSalary] = useState(null);
    const [jobTitleVal,setJobTitleVal] = useState(null);
    const [managerId,setManagerId] = useState(null);
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);
    const [msg,setMsg] = useState(null);
    const toast = useRef(null);

    useEffect(()=>{
        axios.get('http://localhost:8081/api/jobtype',{
            headers:{
                'Authorization' : 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp=>{
            console.log("test", resp.data);
            setJobTitle(resp.data)
        });

        axios.get('http://localhost:8081/api/manager/all',{
            headers:{
                'Authorization' : 'Basic ' + localStorage.getItem('token')
            }
        }).then(resp=>{
            setManagers(resp.data)
        });
    },[]);

    const addEmployee = ()=>{
        if (!name || !city || !salary || !jobTitle || !username || !password) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Some Infomation is missing please check again!',
                life: 3000,
            });
        }
        let data = {
            "name": name,
            "city": city,
            "salary": salary,
            "jobTitle": jobTitleVal,
            "userInfo":{
                "username": username,
                "password": password
            }
        }

        axios.post('http://localhost:8081/api/employee/add/'+ managerId,
             data,
             {
                headers:{
                    'Authorization' : 'Basic ' + localStorage.getItem('token')
                }
            }
        ).then(resp=>{
            //  console.log(resp)
            //  setMsg('Employee Onboarded Successfully..')
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Employee Onboarded Successfully..',
                life: 3000,
            });
            // setName(null)
            // setCity(null)
            // setSalary(null)
            // setJobTitle(null)
            // setUsername(null)
            // setPassword(null)
        })
        .catch(err=>{
            // console.log(err)
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Employee Onboarding Failed.. please contact IT Admin',
                life: 3000,
            });
            // setMsg('Employee Onboarding Failed.. please contact IT Admin')
        })

        window.scroll(0,0);
    }
    return(
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body employee-form">
                            {
                                msg === null?'':
                                <div class="alert alert-primary" role="alert">
                                    {msg}
                                </div>
                            }
                        
                            <div className="mb-3">
                                <h4>Personal Info</h4>
                            </div>
                            <div class="mb-3">
                                <label className="form-label">Enter Name: </label>
                                <input type="text" class="form-control" placeholder="Enter full name" 
                                    onChange={(e)=>setName(e.target.value)}/>
                            </div>
                            <div class="mb-3">
                                <label className="form-label">Enter City: </label>
                                <input type="text" class="form-control" placeholder="Enter city" 
                                    onChange={(e)=>setCity(e.target.value)} />
                            </div>
                            <div class="mb-3">
                                <label className="form-label">Enter Salary: </label>
                                <input type="number" class="form-control" placeholder="Enter salary" 
                                    onChange={(e)=>setSalary(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Select Job Title: </label>
                                <select className="form-select" aria-label="Default select example" 
                                    onChange={(e)=>setJobTitleVal(e.target.value)}>
                                        <option selected> </option>
                                        {
                                            jobTitle.map((e,index)=>(
                                                <option value={e} key={index}>{e}</option>
                                            ))
                                        }
                                        
                                </select>
                            </div>
                            <div className="mb-3">
                                <h4>Assign Manager</h4>
                            </div>         
                            <div className="mb-3">
                                <label className="form-label">Select Manager: </label>
                                <select className="form-select" aria-label="Default select example" 
                                    onChange={(e)=>setManagerId(e.target.value)}>
                                        <option selected> </option>
                                        {
                                            managers.map((m,index)=>(
                                                <option value={m.id} key={index}>{m.name}</option>
                                            ))
                                        }
                                        
                                </select>
                            </div>      
                            <div className="mb-3">
                                <h4>Employee Credentials</h4>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Enter Username: </label>
                                <input type="text" class="form-control" placeholder="Enter username" 
                                    onChange={(e)=>setUsername(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Enter Password: </label>
                                <input type="text" class="form-control" placeholder="Enter password" 
                                    onChange={(e)=>setPassword(e.target.value)}/>
                            </div>
                        <div className="mb-3">
                            <Toast ref={toast} />
                            <div className="flex flex-wrap gap-2">
                                <Button label="Add Employee" severity="info" onClick={addEmployee} style={{marginBottom:'30px', borderRadius:'18px', fontSize:'12px'}} />
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeOnBoarding;