import axios from "axios";
import { useEffect, useState } from "react";
import './login.css'
import { useSearchParams, useNavigate } from "react-router-dom";
import Logo from "../asset/logo/incedologo.jpg"

function Login(){
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);
    const [errorMsg,setErrorMsg] = useState('');
    const navigate = useNavigate();
    const [param] = useSearchParams();
    const [msg,setMsg] = useState(param.get('msg'));
    useEffect(() => {
      if (msg === 'logged_out' ) {
        localStorage.clear();
      }
    }, []);


    const onLogin = ()=>{
        let token = window.btoa(username + ":" + password)
        axios.get('http://localhost:8081/api/login',{
            headers: {
                'Authorization': 'Basic ' + token
            }
        })
        .then(response=>{
            console.log(response.data);
            let user = {
              'token': token,
              'username': username,
              'role': response.data.role
            }
            
            localStorage.setItem('token', token)
            localStorage.setItem('username',username)
            localStorage.setItem('role',user.role)
            
            if(user.role === 'HR'){
              navigate('/hr');
              return; 
            } else if (user.role === 'EMPLOYEE') {
              navigate('/employee');
              return; 
            }
            
        })
        .catch(error=>{
             setErrorMsg('Invalid Credentials')
        })
    }
    return (
      <div className="customer-container">
      <div className="customer-form">
        <div className='form-content'>
          <img src={Logo} style={{width : "300px"}}/>
          <br /> <br />
          <span>Welcome to Incedo Payroll System</span>
          <h1 style={{fontWeight:'bold'}}>Login</h1>
          <div>{errorMsg}</div>
          {
            msg === "" || msg === undefined || msg === null?'':<div className="alert alert-dark" role="alert">
            You have logged Out
          </div>
          }
          <label>Enter username: </label>
          <input type="text" onChange={(e)=>setUsername(e.target.value) }/> 
          
          <br /><br />
          <label>Enter Password: </label>
          <input type="text" onChange={(e)=>setPassword(e.target.value)}/>
          
          <br /><br />
    
          <button onClick={()=>onLogin()}>LOGIN</button> 
          
        </div>
      </div>
      <footer style={{backgroundColor: '#0B1941', color: 'white', position: 'fixed', width: '100%', bottom: '0'}}>
        <div style={{padding: '20px', textAlign: 'center'}}>
          <p>100 Campus Dr</p>
          <p>Florham Park, NJ 07932</p>
        </div>
      </footer>
    </div>
    
    
    )
}

export default Login;