import { createSlice } from "@reduxjs/toolkit";

const CounterSlice = createSlice({
  name: "Counter",
  initialState: {value:0},
  reducers: 
  {
    increment(state,action)
    {
        state.value+=1;
    } , 
    decrement(state,action)
    {   
        state.value--;

    },
    add(state,action)
    {
        state.value+=action.payload;
    }
  },
});

// console.log(CounterSlice)
export const {increment,decrement,add} = CounterSlice.actions;


export default CounterSlice;