import { useNavigate } from "react-router-dom";
import Logo  from "../../../asset/logo/incedologo.jpg";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

function Navbar(){
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const logout = ()=>{
      localStorage.clear();
      navigate('/?msg=logged_out')
    }

    const start = (
        <div style={{display:'flex', alignItems:'center'}}>
            <img
                alt = 'logo'
                src= {Logo}
                height= "40"
                className="mr-2"
                style={{marginRight:'10px'}}
            />
            <span style={{fontWeight:"bold",  fontfamily: 'Montserrat', fontSize: "24px"}}>
                 Employee Dashboard
            </span>
        </div>
    );

    const end = (
        <div>
            {username && (
                <span style={{fontWeight:"bold", right: "220px", marginTop:"15px", position:'absolute'}}>
                    Welcome {username} 
                    &nbsp;&nbsp;
                    <i className="pi pi-user" style={{ color: '#708090' }}></i>
                </span>
            )}
            <Button
                onClick={logout}
                style = {{
                    backgroundColor:'#0B1941',
                    color:'white',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    right: '50px'
                }}
            >
                <i className="pi pi-sign-out" style={{ color: 'white', fontWeight:"bold" }}></i>
                &nbsp;&nbsp;
                <span style={{fontWeight:'bold'}}>Log Out</span>
            </Button>
        </div>
    );
    return(
        
        <div className="card">
            <Menubar  style={{backgroundColor:"#ffb38a"}} start={start} end = {end} />
        </div>
    )
}
export default Navbar;