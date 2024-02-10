import { createSlice, nanoid } from "@reduxjs/toolkit";



const allMessageSlice=
createSlice(
    {
        name:"allMessage",
        initialState:{value:[]},
        reducers:{
            
            SetallMessage(state,action)
            {
                action.payload["key"]=nanoid();
                console.log(action.payload);
                state.value.push(action.payload);
            },
            EmptyallMessage(state)
            {
                state.value.splice(0);
            }
        }
    }
)

export const {SetallMessage,EmptyallMessage} = allMessageSlice.actions;

export default allMessageSlice;