import { Link, useNavigate } from "react-router-dom";
import Logo  from "../../../asset/logo/incedologo.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar(){
    const navigate = useNavigate();
    const logout = ()=>{
      localStorage.removeItem('token');
      navigate('/?msg=logged_out', {replace : true})
    }
    return(
        <nav className="navbar navbar-expand-lg" data-bs-theme="light"  style={{ backgroundColor: 'white', color: 'gray'}}>
          <div className="container-fluid">
            <img src = {Logo} width = "100" height = "30"></img> &nbsp;&nbsp;
            <span   className="text-justify"
                style={{  
                  fontsize: "24px",
                  fontWeight: "600",
                  fontFamily: 'Verdana, Arial, Helvetica, sans-serif' }}>
                    HR Dashboard
              </span>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {/* <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/employee-onboarding">Add Employee</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/project">Project</Link>
                </li> */}
                {/* <li className="nav-item">
                  <Link className="nav-link active" to="/salary-detail">Salary Details</Link>
                </li> */}
                
              </ul>
              <span>Welcome {localStorage.getItem('username')} &nbsp;&nbsp;&nbsp;</span>
              <i className="pi pi-user" style={{ color: '#708090' }}></i>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button className="btn btn-secondary"  onClick={logout}>LogOut</button>
            </div>
          </div>
        </nav>
    )
}
export default Navbar;