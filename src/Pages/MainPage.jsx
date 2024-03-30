import { useDispatch } from 'react-redux';

import { EmptyallMessage, SetallMessage } from '../store/allMessage';


import { GetContract } from '../Utils/Util';



import Friends from '../component/Friends';
import Chats from '../component/Chats';




const MainPage = ({  GetFriendList, To, setTO, ConnectToWalletButtonHandler }) => {

    const dis = useDispatch()

    const OpenMessage = async (frn) => {
        dis(EmptyallMessage());

        const contract = await GetContract();
        const txResponse = await contract.GetMessage(frn);
        const name = await contract.GetUserName(frn);
        setTO(name);
        Array.from(txResponse).forEach(
            (e) => {
                let obj = {};
                obj["Text"] = Array.from(e)[0];
                obj["sender"] = Array.from(e)[1];
                obj["receiver"] = Array.from(e)[2];
                obj["TypeOFMessage"] = Number(Array.from(e)[3]);


                dis(SetallMessage(obj))

            }
        )

    }

    return (
        <>

            <div className='flex flex-row '>
                <div className='basis-2/5 border-r-4'>
                    <Friends GetFriendList={GetFriendList} OpenMessage={OpenMessage}  ></Friends>
                </div>
                <div className='basis-3/5'>
                    <Chats ConnectToWalletButtonHandler={ConnectToWalletButtonHandler} OpenMessage={OpenMessage} TO={To}></Chats>
                </div>
            </div>
        </>
    )
}


export default MainPage

