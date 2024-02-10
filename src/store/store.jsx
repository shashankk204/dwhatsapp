import { configureStore } from '@reduxjs/toolkit'
import CounterSlice from './counter'
import ConnectedSlice from './Connected';
import AddressSlice from './Address';
import UserExistSlice from './UserExist';
import UserNameSlice from './UserName';
import ActiveSlice from './Active';
import FriendListSlice from './FriendList';
import allMessageSlice from './allMessage';

export const store = configureStore({
  reducer: {
    Counter:CounterSlice.reducer,
    Connected:ConnectedSlice.reducer,
    Address:AddressSlice.reducer,
    UserExist:UserExistSlice.reducer,
    UserName:UserNameSlice.reducer,
    Active:ActiveSlice.reducer,
    FriendList:FriendListSlice.reducer,
    allMessage:allMessageSlice.reducer,
    
  },
})


export default store;