import { useEffect, useState } from 'react';
import { abi } from '../abi/chat.json'
import { ContractAddress } from "../assets/contants"
import { ethers } from 'ethers';



const Friends = ({ provider, GetFriendList, FriendList, SetfriendList, SetActive, Active, OpenMessage, FriendsName }) => {

    const [frnTxt, SetfrnTxt] = useState("");





    const AddFriend = async () => {

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract.Addfriend(frnTxt);
        const receipt = await txResponse.wait();

        SetfriendList([...FriendList, frnTxt]);
        SetfrnTxt("");

    }

    // const GetUserName=async(address)=>
    // {
    //     const signer = await provider.getSigner();
    //     const contract = new ethers.Contract(ContractAddress, abi, signer);
    //     const Name = await contract.GetUserName(address);
    //     return Name;
    // }


    useEffect(() => {
        GetFriendList();
    }, []);



    return (<>
        <ul>{(FriendList).map(
           
           (e) => {


                return (<li key={e}>
                    <button value={e} onClick={async (e) => {
                        SetActive(e.target.value);
                        await OpenMessage(e.target.value);
                    }}>{e}</button>
                </li>)
            }
        )}</ul>
        {/* <ul>{FriendList.map(
            (e) => {
                return (<li key={e}>
                    <button value={e} onClick={async (e) => {
                        SetActive(e.target.value);
                        await OpenMessage(e.target.value);
                    }}>{FriendsName[e]}</button>
                </li>)
            }
        )}</ul> */}
        <>
            <input type="text" name="Friends address" placeholder='Friends address' value={frnTxt} onChange={(e) => { SetfrnTxt(e.target.value) }} />
            <button className="bg-blue-400" onClick={AddFriend}>Add Friend</button>
        </>
    </>)
}



const Chats = ({ provider, Active, allMessage, SetallMessage, Address, TO, OpenMessage }) => {
    const [Messagetxt, SetMessagetxt] = useState("");

    const Eventlistener = (allMessage) => {
        const contract = new ethers.Contract(ContractAddress, abi, provider);
        contract.on("NewMessage", async (sender, receiver) => {
            
            if (receiver.toUpperCase()
                == Address.toUpperCase() && Active.toUpperCase()==sender.toUpperCase()) {
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(ContractAddress, abi, signer);
                const txResponse = await contract.GetMessage(sender);
                if (Array.from(txResponse).length != allMessage.length) {
                    console.log(allMessage);
                    SetallMessage(Array.from(txResponse));
                }
            }
        });
    }
    useEffect(() => {
        Eventlistener(allMessage);
    }, [Active]);

    const sendMessage = async () => {
        const signer = await provider.getSigner();
        const walletAddress = await signer.getAddress();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        // const txResponse = await contract["SendMessage(string calldata Messagetxt,address Active)"](Messagetxt, Active);
        const txResponse = await contract.SendMessage(Messagetxt, Active, BigInt(0));
        const receipt = await txResponse.wait();
        SetallMessage([...allMessage, { Text: Messagetxt, sender: walletAddress, receiver: Active }]);
        SetMessagetxt("");
    }

    return (
        <>
            <div>

                <h1>{`TO ${TO}`}</h1>
                {(Active == "") ? (<></>) : (<>
                    <div>Active{Active}</div>
                    <input type="text" placeholder='Type your Message' value={Messagetxt} onChange={(e) => { SetMessagetxt(e.target.value) }} />
                    <button className="bg-blue-400" onClick={sendMessage}>Send</button></>)}
            </div>



            <div>
                {allMessage.map((e) => {
                    return (<div>
                        sender:{e.sender}
                        <br />
                        Message:{e.Text}
                    </div>)
                })}
            </div>
        </>
    )
}















const MainPage = ({ provider, Address, GetFriendList, FriendList, SetfriendList, SetActive, Active, allMessage, SetallMessage, To, setTO }) => {



    const OpenMessage = async (frn) => {
        SetallMessage([]);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract.GetMessage(frn);
        const name = await contract.GetUserName(frn);
        setTO(name);
        SetallMessage(Array.from(txResponse))

    }

    return (
        <>
            <Friends provider={provider} To={To} setTO={setTO} Active={Active} GetFriendList={GetFriendList} FriendList={FriendList} SetfriendList={SetfriendList} SetActive={SetActive} OpenMessage={OpenMessage} ></Friends>
            <Chats provider={provider} Active={Active} OpenMessage={OpenMessage} Address={Address} allMessage={allMessage} SetallMessage={SetallMessage} setTO={setTO} TO={To}></Chats>
        </>
    )
}


export default MainPage

