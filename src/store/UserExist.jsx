import { createSlice } from "@reduxjs/toolkit";



const UserExistSlice=
createSlice(
    {
        name:"UserExist",
        initialState:{value:false},
        reducers:
        {
            SetUserExist(state,action)
            {
                state.value=action.payload;
            }
        }
    }
)



export const {SetUserExist}=UserExistSlice.actions;

export default UserExistSlice;