import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { GetContract, GetContractWithOutSigner, GetSigner } from '../Utils/Util';


import Nav from '../component/Nav';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';


const Chats = ({TO, ConnectToWalletButtonHandler }) => {

    const [Messagetxt, SetMessagetxt] = useState("");
   
    const dis = useDispatch()
    const Address = useSelector(state => state.Address.value);
    const Active = useSelector(state => state.Active.value);
    const allMessage = useSelector(state => state.allMessage.value);
   


   
   
    const [LoadingSend, setLoading] = useState(false);
    const [DisabledSend, setDisabled] = useState(false);
    const sendMessage = async () => {
        setLoading(true)
        setDisabled(true)
        const signer = await GetSigner();
        const walletAddress = await signer.getAddress();
        const contract = await GetContract();
        const txResponse = await contract.SendMessage(Messagetxt, Active, BigInt(0));
        const receipt = await txResponse.wait();
        dis(SetallMessage({ Text: Messagetxt, sender: walletAddress, receiver: Active, TypeOFMessage: 0 }));
        SetMessagetxt("");
        setLoading(false)
        setDisabled(false)
    }

  
    const newMessageEventListener=async (sender,receiver)=>
    {
        if (receiver.toUpperCase() == Address.toUpperCase() && Active.toUpperCase() == sender.toUpperCase()) 
        {
            const contract = await GetContract();
            const txResponse = await contract.GetMessage(sender);
            let n = Array.from(txResponse).length
            let arr = Array.from(txResponse)[n - 1];
            arr = Array.from(arr);
            let obj = {};
            obj["Text"] = arr[0];
            obj["sender"] = arr[1];
            obj["receiver"] = arr[2];
            obj["TypeOFMessage"] = Number(arr[3]);
            dis(SetallMessage(obj));
        }
    }



    useEffect(() => {
        const contract = GetContractWithOutSigner();
        contract.on("NewMessage", newMessageEventListener)
        return (
            () => 
            {
                contract.off("NewMessage", newMessageEventListener)
            })
    }, [Active]);



    return (
        <>
            {(Active == "") ? (<></>) :
                (<>

                    <div className="flex flex-col h-screen">

                        <h1 className="bg-gray-200 sticky top-0 z-10 py-7 px-28 flex justify-between items-center" >
                            <span>

                                {`${TO}`}
                            </span>
                            <span>

                                <Nav ConnectToWalletButtonHandler={ConnectToWalletButtonHandler}></Nav>
                            </span>
                        </h1>

                        <div className="flex-1 overflow-y-auto flex flex-col-reverse">
                            {allMessage.slice().reverse().map((e) => {
                                const isMessageFromActiveUser = (e.sender.toUpperCase() === Active.toUpperCase());
                                const messageClass = !isMessageFromActiveUser ? "justify-end" : "justify-start";
                                return (
                                    <div className={`flex ${messageClass} mb-2`} key={e.key}>

                                        <div className={`bg-gray-300 p-2 rounded  : ''}`}>

                                            <div className='p-4' >


                                                {e.Text}
                                            </div>
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                        <div className="bg-gray-200 py-3 flex justify-center">

                            <input type="text" placeholder='Type your Message' className='w-96 px-2 py-3 rounded-3xl' value={Messagetxt} onChange={(e) => { SetMessagetxt(e.target.value) }} />
                            {/* <button className="bg-blue-800" onClick={sendMessage}>Send</button> */}
                            <LoadingButton
                                onClick={sendMessage}
                                endIcon={<SendIcon />}
                                loading={LoadingSend}
                                loadingPosition="end"
                                variant="contained"
                                disabled={DisabledSend}
                            >
                                <span>Send</span>
                            </LoadingButton>
                        </div>
                    </div>
                </>)}
        </>
    )
}

export default Chats