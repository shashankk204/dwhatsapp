import { createSlice } from "@reduxjs/toolkit";



const ActiveSlice=
createSlice(
    {
        name:"Active",
        initialState:{value:""},
        reducers:
        {
            SetActive(state,action)
            {
                state.value=action.payload;
            }
        }
    }
)


export const {SetActive} = ActiveSlice.actions;
export default ActiveSlice;