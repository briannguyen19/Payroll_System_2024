const initialState = {
    projects: []
};

const project = (state = initialState, action) => {
    if (action.type === 'GET_EMPLOYEE_PROJECTS') {
        return { ...state, projects: action.payload };
    }

    return state;
};

export default project;