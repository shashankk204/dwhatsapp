import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { EmptyallMessage, SetallMessage } from '../store/allMessage';


import { GetContract, GetSigner } from '../Utils/Util';



import Friends from '../component/Friends';
import Chats from '../component/Chats';
import { SetAddress } from '../store/Address';
import { SetConnected } from '../store/Connected';
import { SetUserExist } from '../store/UserExist';
import { SetUserName } from '../store/UserName';
import { EmptyFriendList, SetFriendList } from '../store/FriendList';
import { useNavigate } from 'react-router-dom';
import { SepoliaChainId } from '../assets/contants';
import { SetActive } from '../store/Active';




const MainPage = () => {


    const [To, setTO] = useState("")
    const [ChainID, SetChainID] = useState("");

    const Dispatch = useDispatch()

    const navigate = useNavigate();


    const OpenMessage = async (frn) => {
        Dispatch(EmptyallMessage());
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


                Dispatch(SetallMessage(obj))

            }
        )

    }
    const CheckUser = async () => {
        let signer = await GetSigner();
        const contract = await GetContract();
        let bool = await contract.CheckUser(signer);
        if (bool) {
            const Name = await contract.GetUserName(signer);
            Dispatch(SetUserName(Name));
        }
        return (bool);
    }

    const GetFriendList = async () => {
        const contract = await GetContract();
        const txn = await contract.allfriend();
        Dispatch(EmptyFriendList());
        Array.from(txn).forEach(async (e) => {
            let name = await contract.GetUserName(e)
            let id = e;
            let obj = {}
            obj[id] = name
            Dispatch(SetFriendList(obj));
        })
    }



    const NetworkConnected = async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if(chainId!=SepoliaChainId)
        {
            alert("connect to sepolia network")
        }
        else if (accounts.length !== 0) {
            Dispatch(SetAddress(accounts[0]));
            Dispatch(SetConnected(true));
            let x = await CheckUser();
            if (x) {
                Dispatch(SetUserExist(x))
                await GetFriendList()

            }
            else {
                navigate("/signup")
            }

        }
        else {
            navigate("/");
        }
        SetChainID(chainId);

    }

    async function handleAccountsChanged(accounts) 
    {
        setTO("");
        Dispatch(SetAddress(accounts[0]));
        Dispatch(SetUserName(""))
        if (accounts.length != 0) 
        {
          let x = await CheckUser();
          Dispatch(SetUserExist(x));
          if (x == true) 
          {
            await GetFriendList();
            Dispatch(EmptyallMessage());
            Dispatch(SetActive(""));
          }
          else
          {
            Dispatch(EmptyallMessage());
            Dispatch(SetActive(""));
            navigate('/signup');
          }
        }
      }


    useEffect(
        () => {
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', (chainID) => { SetChainID(chainID) ;NetworkConnected();});
    
          return () => {
            window.ethereum.off('accountsChanged', handleAccountsChanged);
            window.ethereum.off('chainChanged', (chainID) => { SetChainID(chainID);NetworkConnected();});
    
          }
        }, [])




    useEffect(() => { NetworkConnected() },[]);








    return (ChainID!=SepoliaChainId)?(<h1>Please Connect to Sepolia Newtork{ChainID}</h1>):(
        <>

            <div className='flex flex-row '>
                <div className='basis-2/5 border-r-4'>
                    <Friends OpenMessage={OpenMessage}  ></Friends>
                </div>

                <div className='basis-3/5'>
                    <Chats OpenMessage={OpenMessage} TO={To}></Chats>
                </div>
            </div>
        </>
    )
}


export default MainPage

