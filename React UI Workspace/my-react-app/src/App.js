import { Route, Routes, useLocation, useNavigate } from "react-router";
import Login from "./auth/login";
import HR from "./features/hr/hr";
import { Provider } from "react-redux";
import Employee from "./features/employee/employee";
import store from "./store";
import { useEffect } from "react";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token && location.pathname !== '/') {
            navigate('/?msg=logged_out');
        }
    },[navigate]);
   return(
    <div>
        <Provider store={store}>
        <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/hr" element={<HR />}></Route>
            <Route path="/employee" element={<Employee />}></Route> 
        </Routes>
        </Provider>
    </div>
   )
}

export default App;
