const intialState =[]

const employee = (state=intialState,action)=>{
      if(action.type === 'GET_ALL_EMPLOYEE'){
        // console.log("Reducer:", action.payload);
        let temp = action.payload; 
        return action.payload;

        // return {...state, list: temp}
      }

    return state; 
}

export default employee;