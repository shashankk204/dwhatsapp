import { useEffect, useState } from 'react';
import { abi } from '../abi/chat.json'
import { ContractAddress } from "../assets/contants"
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { SetActive } from '../store/Active';
import { SetFriendList } from '../store/FriendList';
import { EmptyallMessage, SetallMessage } from '../store/allMessage';













const Friends = ({ provider, GetFriendList, OpenMessage }) => {
    const Connected = useSelector(state => state.Connected.value)
    const [frnTxt, SetfrnTxt] = useState("");
    const dis = useDispatch()
    const FriendList = useSelector(state => state.FriendList.value)


    const AddFriend = async () => {

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract.Addfriend(frnTxt);
        const receipt = await txResponse.wait();
        // const name=await contract.user
        const Name = await contract.GetUserName(frnTxt)
        let obj = {}
        obj[frnTxt] = Name
        dis(SetFriendList(obj));
        SetfrnTxt("");

    }



    useEffect(() => {

        if (Connected) {
            GetFriendList()
        };

    }, []);



    return (<>
        <div className="flex flex-col h-screen">
            <div className="bg-gray-200 py-7 sticky top-0 z-10 ">

                <div className='flex justify-center'>

                    <input type="text" name="Friends address" placeholder='Friends address' value={frnTxt} onChange={(e) => { SetfrnTxt(e.target.value) }} />
                    <button className="bg-blue-400" onClick={AddFriend}>Add Friend</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">

                <ul>{(FriendList).map(

                    (e) => {
                        const k = Object.keys(e);
                        const v = Object.values(e)
                        return (<li key={k}>
                            <button value={k} onClick={async (e) => {
                                dis(SetActive(e.target.value));
                                await OpenMessage(e.target.value);
                            }}>{v}</button>
                        </li>)
                    }
                )}</ul>
            </div>

        </div>
        <>
        </>
    </>)
}

































const Chats = ({ provider, TO }) => {

    const [Messagetxt, SetMessagetxt] = useState("");
    const Address = useSelector(state => state.Address.value);
    const Active = useSelector(state => state.Active.value);
    const allMessage = useSelector(state => state.allMessage.value);
    const dis = useDispatch()
    // const Eventlistener = () => {
    //     const contract = new ethers.Contract(ContractAddress, abi, provider);
    //     contract.on("NewMessage", async (sender, receiver) => {

    //         if (receiver.toUpperCase()
    //             == Address.toUpperCase() && Active.toUpperCase()==sender.toUpperCase()) {
    //             const signer = await provider.getSigner();
    //             const contract = new ethers.Contract(ContractAddress, abi, signer);
    //             const txResponse = await contract.GetMessage(sender);
    //             let n=Array.from(txResponse).length
    //             console.log(allMessage);
    //             dis(SetallMessage(Array.from(txResponse)[n-1]));

    //         }
    //     }
    //     );
    // }
    useEffect(() => {
        const contract = new ethers.Contract(ContractAddress, abi, provider);
        contract.on("NewMessage", async (sender, receiver) => {

            if (receiver.toUpperCase()
                == Address.toUpperCase() && Active.toUpperCase() == sender.toUpperCase()) {
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(ContractAddress, abi, signer);
                const txResponse = await contract.GetMessage(sender);
                let n = Array.from(txResponse).length
                let arr = Array.from(txResponse)[n - 1];
                arr = Array.from(arr);
                console.log("allmessages", arr);
                let obj = {};
                obj["Text"] = arr[0];
                obj["sender"] = arr[1];
                obj["receiver"] = arr[2];
                obj["TypeOFMessage"] = Number(arr[3]);
                dis(SetallMessage(obj));

            }
        }
        )
        return (
            () => {
                contract.off("NewMessage", async (sender, receiver) => {

                    if (receiver.toUpperCase()
                        == Address.toUpperCase() && Active.toUpperCase() == sender.toUpperCase()) {
                        const signer = await provider.getSigner();
                        const contract = new ethers.Contract(ContractAddress, abi, signer);
                        const txResponse = await contract.GetMessage(sender);
                        let n = Array.from(txResponse).length
                        console.log(allMessage);
                        dis(SetallMessage(Array.from(txResponse)[n - 1]));

                    }
                }
                )
            }
        )
    }, [Active]);

    const sendMessage = async () => {
        const signer = await provider.getSigner();
        const walletAddress = await signer.getAddress();
        const contract = new ethers.Contract(ContractAddress, abi, signer);
        const txResponse = await contract.SendMessage(Messagetxt, Active, BigInt(0));
        const receipt = await txResponse.wait();

        dis(SetallMessage({ Text: Messagetxt, sender: walletAddress, receiver: Active, TypeOFMessage: 0 }));
        SetMessagetxt("");
    }

    return (
        <>
            {(Active == "") ? (<></>) :
                (<>

                    <div className="flex flex-col h-screen">

                        <h1 className="bg-gray-200  sticky top-0 z-10 py-7 px-28" >{`${TO}`}</h1>

                        <div className="flex-1 overflow-y-auto">
                            {allMessage.map((e) => {
                                const isMessageFromActiveUser = (e.sender.toUpperCase() === Active.toUpperCase());
                                const messageClass = isMessageFromActiveUser ? "justify-end" : "justify-start";
                                return (<>
                                    <div className={`flex ${messageClass} mb-2`} key={e.key}>

                                        <div className={`bg-gray-300 p-2 rounded  : ''}`}>

                                            <div className='p-4' >


                                                {e.Text}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )
                            })}
                        </div>
                        <div className="bg-gray-200 py-6">

                            <input type="text" placeholder='Type your Message' value={Messagetxt} onChange={(e) => { SetMessagetxt(e.target.value) }} />
                            <button className="bg-blue-800" onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </>)}
        </>
    )
}
























const MainPage = ({ provider, GetFriendList, To, setTO }) => {

    const dis = useDispatch()

    const OpenMessage = async (frn) => {
        dis(EmptyallMessage());
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(ContractAddress, abi, signer);
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
                    <Friends provider={provider} GetFriendList={GetFriendList} OpenMessage={OpenMessage}  ></Friends>
                </div>
                <div className='basis-3/5'>
                    <Chats provider={provider} OpenMessage={OpenMessage} TO={To}></Chats>
                </div>
            </div>
        </>
    )
}


export default MainPage

