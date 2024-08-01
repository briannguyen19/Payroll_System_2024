import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../hr.css';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button'; 


function SalaryDetail({employeeId, onSalaryDetailAdded}) {
    const [employees, setEmployees] = useState([]);
    // const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [baseSalary, setBaseSalary] = useState('');
    const [bonus, setBonus] = useState('');
    const [stock, setStock] = useState('');
    const [msg, setMsg] = useState(null);
    const [dates, setDates] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:8081/api/employee/getall', {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token')
            }
        })
        .then(resp => {
            setEmployees(resp.data);
        })
        .catch(err => {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There is an error, please contact the admin',
                life: 3000,
            });
        });
    }, []);

    const addSalaryDetail = () => {
        if (!dates[0] == null || !baseSalary || !bonus || !stock) {
            toast.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'There is an information missing, please check again',
                life: 3000,
            });
            return;
        }
        let effectiveDate = new Date(dates).toISOString().split("T")[0];

        const salaryDetail = {
            baseSalary: parseFloat(baseSalary),
            bonus: parseFloat(bonus),
            stock: parseFloat(stock),
            effectiveDate : effectiveDate
        };

        axios.post(`http://localhost:8081/api/salary-detail/add/${employeeId}`, salaryDetail, {
            headers: {
                'Authorization': 'Basic ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Salary detail added successfully.',
                life: 3000,
            });
            setBaseSalary('');
            setBonus('');
            setStock('');
            setDates('');
            if (onSalaryDetailAdded) {
                onSalaryDetailAdded();
            }
        }).catch(err => {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add salary detail. Please contact IT Admin.',
                life: 3000,
            });
        });

        window.scroll(0, 0);
    };

    return (
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body employee-form">
                                {msg && <div className="alert alert-primary" role="alert">{msg}</div>}
                                {/* <div className="mb-3">
                                    <label className="form-label">Select Employee:</label>
                                    <select className="form-select" aria-label="Default select example" value={employeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">Base Salary:</label>
                                    <input type="number" className="form-control" placeholder="Enter base salary" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Bonus:</label>
                                    <input type="number" className="form-control" placeholder="Enter bonus" value={bonus} onChange={(e) => setBonus(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Stock:</label>
                                    <input type="number" className="form-control" placeholder="Enter stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                                </div>
                                <label> Effective Date: </label>
                                <br />
                                <div className="card flex justify-content-center">
                                <Calendar
                                    value={dates}
                                    onChange={(e) => setDates(e.value)}
                                    readOnlyInput
                                    hideOnRangeSelection
                                />
                                </div>
                                <br />
                                <div className="mb-3">
                                    <Toast ref={toast} />
                                    <div className="flex flex-wrap gap-2">
                                        <Button label="Add Salary Detail" severity="info" onClick={addSalaryDetail} style={{marginBottom:'30px', borderRadius:'18px', fontSize:'12px'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default SalaryDetail;
