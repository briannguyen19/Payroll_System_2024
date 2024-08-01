import { configureStore } from '@reduxjs/toolkit';
import project from './store/reducer/project';
import employee from './store/reducer/employee';

export default configureStore({
    reducer: {
        project : project,
        employee: employee
    }
});
