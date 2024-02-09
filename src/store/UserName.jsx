import { createSlice } from "@reduxjs/toolkit";



const UserNameSlice=
createSlice(
    {
        name:"UserName",
        initialState:{value:""},
        reducers:
        {
            SetUserName(state,action)
            {
                state.value=action.payload;
            }
        }
    }
)



export const {SetUserName}=UserNameSlice.actions;
export default UserNameSlice;