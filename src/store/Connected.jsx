import { createSlice } from "@reduxjs/toolkit";

const ConnectedSlice=createSlice({
    name:"Connected",
    initialState:{value:false},
    reducers:
    {
        SetConnected(state,action)
        {
            state.value=action.payload;
        },
    }}
)


export const{SetConnected}=ConnectedSlice.actions
export default ConnectedSlice