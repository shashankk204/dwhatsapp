import { useEffect, useState } from 'react';
import { abi } from '../abi/chat.json'
import { ContractAddress } from "../assets/contants"
import { ethers } from 'ethers';



const Friends = ({ provider, GetFriendList, FriendList, SetfriendList, SetActive, Active, OpenMessage }) => {

    const [frnTxt, SetfrnTxt] = useState("");





    const AddFriend = async () => {

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract["Addfriend(address frnTxt)"](frnTxt);
        const receipt = await txResponse.wait();
        console.log(receipt);

        SetfriendList([...FriendList, frnTxt]);
        SetfrnTxt("");

    }


    useEffect(() => {
        GetFriendList();
        // const fl=["asd",'asf',"as"];

    }, []);



    return (<>
        <ul>{FriendList.map(
            (e) => {
                return (<li key={e}>
                    <button value={e} onClick={async (e) => {
                        SetActive(e.target.value);
                        await OpenMessage(e.target.value);
                    }}>{e}</button>
                </li>)
            }
        )}</ul>
        <>
            <input type="text" name="Friends address" placeholder='Friends address' value={frnTxt} onChange={(e) => { SetfrnTxt(e.target.value) }} />
            <button className="bg-blue-400" onClick={AddFriend}>Add Friend</button>
        </>
    </>)
}



const Chats = ({ provider, Active, allMessage, SetallMessage }) => {
    const [Messagetxt, SetMessagetxt] = useState("");


    const sendMessage = async () => {
        const signer = await provider.getSigner();
        const  walletAddress = await signer.getAddress();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract["SendMessage(string calldata Messagetxt,address Active)"](Messagetxt, Active);
        const receipt = await txResponse.wait();
        SetallMessage([...allMessage,{Text:Messagetxt,sender:walletAddress,receiver:Active}]);
        SetMessagetxt("");
        console.log(receipt);
    }

    return (
        <>
        <div>

            <h1>{`TO ${Active}`}</h1>
            {(Active == "") ? (<></>):(<>
                <div></div>
                <input type="text" placeholder='Type your Message' value={Messagetxt} onChange={(e) => { SetMessagetxt(e.target.value) }} />
                <button className="bg-blue-400" onClick={sendMessage}>Send</button></>)}
        </div>
        
        
        
        <div>
            {allMessage.map((e)=>{
                return(<div key={e.sender}>
                    sender:{e.sender}
                    <br />
                    Message:{e.Text}
                </div>)
            })}
        </div>
        </>
    )
}















const MainPage = ({ provider, GetFriendList, FriendList, SetfriendList, SetActive, Active, allMessage, SetallMessage }) => {

    const OpenMessage = async (frn) => {
        SetallMessage([]);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract["GetMessage(address frn)"](frn);
        // txResponse=;
        // txResponse.map((e)=>{return Array.from(e)});
        SetallMessage(Array.from(txResponse))
        console.log(txResponse);

    }

    return (
        <>
            <Friends provider={provider} Active={Active} GetFriendList={GetFriendList} FriendList={FriendList} SetfriendList={SetfriendList} SetActive={SetActive} OpenMessage={OpenMessage}></Friends>
            <Chats provider={provider} Active={Active} allMessage={allMessage} SetallMessage={SetallMessage}></Chats>
        </>
    )
}


export default MainPage

