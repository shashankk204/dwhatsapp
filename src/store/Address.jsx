import { createSlice } from "@reduxjs/toolkit";


const AddressSlice=
createSlice(
    {
        name:"Address",
        initialState:{value:""},
        reducers:
        {
            SetAddress(state,action){
                state.value=action.payload;
            }
        }
    }
)


export const {SetAddress}=AddressSlice.actions

export default AddressSlice;