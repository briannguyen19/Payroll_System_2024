import axios from 'axios';

export const getEmployeeProjects = () => (dispatch) => {
    axios.get('http://localhost:8081/api/employee/projects', {
        headers: {
            'Authorization': 'Basic ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        dispatch({
            type: 'GET_EMPLOYEE_PROJECTS',
            payload: response.data
        });
    })
    .catch(error => {
        console.error('There was an error fetching the projects!', error);
    });
};
