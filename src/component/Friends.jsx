import {  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SetActive } from '../store/Active';
import {  SetFriendList } from '../store/FriendList';

import { GetContract } from '../Utils/Util';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';



const styleFriendList = {
    p: 0,
    width: '100%',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};

const FriendlistItemStyle = {
    display: 'flex',
    justifyContent: 'center', // Center the text horizontally
    alignItems: 'center',    // Center the text vertically
    padding: '10px',         // Add padding to the ListItem
};










const Friends = ({  OpenMessage }) => {
    const [frnTxt, SetfrnTxt] = useState("");
    const dis = useDispatch()
    const FriendList = useSelector(state => state.FriendList.value)
    const [loading, setLoading] = useState(false);
    const [disabled, setdisabled] = useState(false);



    const AddFriend = async () => {
        setLoading(true);
        setdisabled(true);
        // const signer = await provider.getSigner();
        const contract = await GetContract();
        const txResponse = await contract.Addfriend(frnTxt);
        const receipt = await txResponse.wait();
        // const name=await contract.user
        const Name = await contract.GetUserName(frnTxt)
        let obj = {}
        obj[frnTxt] = Name
        dis(SetFriendList(obj));
        SetfrnTxt("");
        setLoading(false);
        setdisabled(false);
    }

    
     


    



    return (<>
        <div className="flex flex-col h-screen">
            <div className="bg-gray-200 py-7 sticky top-0 z-10 ">

                <div className='flex justify-center'>

                    <input type="text" className="p-1 rounded-md w-96" name="Friends address" placeholder='Friends address' value={frnTxt} onChange={(e) => { SetfrnTxt(e.target.value) }} />
                    {/* <button className="bg-blue-400 mx-3" onClick={AddFriend}>Add Friend</button> */}

                    <LoadingButton
                        onClick={AddFriend}
                        loading={loading}
                        loadingIndicator="Loading…"
                        variant="contained"
                        disabled={disabled}
                    >
                        <span>Add Friend</span>
                    </LoadingButton>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">


                <List sx={styleFriendList} aria-label="mailbox folders">
                    {(FriendList).map(

                        (e) => {
                            const k = Object.keys(e);
                            const v = Object.values(e)

                            return (<div key={k}>
                                <ListItem data-value={k}
                                    onClick={
                                        async (e) => {
                                            dis(SetActive(e.currentTarget.getAttribute('data-value')));
                                            await OpenMessage(e.currentTarget.getAttribute('data-value'));
                                        }
                                    }>
                                    <ListItemText style={FriendlistItemStyle} primary={v} />
                                </ListItem>
                                <Divider component="li" />
                            </div>
                            )
                        }
                    )}
                </List>

            </div>

        </div>
        <>
        </>
    </>)
}


export default Friends