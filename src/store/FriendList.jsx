import { createSlice } from "@reduxjs/toolkit";


const FriendListSlice=
createSlice(
    { 
        name:"FriendList",
        initialState:{value:[]},
        reducers:
        {
            SetFriendList(state,action)
            {
                state.value.push(action.payload);
            },
            EmptyFriendList(state,action)
            {
                state.value.splice(0);
            }
        }
    } 
)



export const {SetFriendList,EmptyFriendList} = FriendListSlice.actions;

export default FriendListSlice