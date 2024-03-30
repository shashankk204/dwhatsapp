import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GetContract, GetSigner } from "./Utils/Util";

import { SetAddress } from "./store/Address";
import { SetConnected } from "./store/Connected";
import { SetUserExist } from "./store/UserExist";
import { SetUserName } from "./store/UserName";
import { SetFriendList, EmptyFriendList } from "./store/FriendList";
import { SetActive } from "./store/Active";
import { EmptyallMessage } from "./store/allMessage";

import Homepage from "./Pages/HomePage";
import CreateAccount from "./Pages/CreateAccount";
import MainPage from "./Pages/MainPage";

import { SepoliaChainId } from "./assets/contants"






function App() {
  
  const Dispatch = useDispatch();
  const Connected = useSelector(state => state.Connected.value);
  const UserExist = useSelector(state => state.UserExist.value);
  
  const [ChainID, SetChainID] = useState("");
  const [To, setTO] = useState("")








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




  const ConnectToWalletButtonHandler = async () => {
    if (Connected == false) {
      let signer = await GetSigner();
      let Uexsits = await CheckUser();
      Dispatch(SetUserExist(Uexsits));
      let walletAddress = await signer.getAddress();
      Dispatch(SetAddress(walletAddress));
      Dispatch(SetConnected(true));
    }
    else {
      await window.ethereum.request({
        "method": "wallet_revokePermissions",
        "params": [
          {
            "eth_accounts": {}
          }
        ]
      });
      Dispatch(SetConnected(false));
      Dispatch(SetUserExist(false));
      Dispatch(SetAddress(""));
    }

  }





  async function handleAccountsChanged(accounts) {
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
      }
    }
  }




  const NetworkConnected = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0) 
    {
        Dispatch(SetAddress(accounts[0]));
        Dispatch(SetConnected(true));
        let x = await CheckUser();
        Dispatch(SetUserExist(x))
    }
    SetChainID(chainId);
  }




  useEffect(() => { NetworkConnected() }, []);
  useEffect(
    () => {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', (chainID) => { SetChainID(chainID) });

      return () => {
        window.ethereum.off('accountsChanged', handleAccountsChanged);
        window.ethereum.off('chainChanged', (chainID) => { SetChainID(chainID) });

      }
    }, []
  )










  return ((ChainID == SepoliaChainId) ?
    (<>{(UserExist) ?
          (<div><MainPage ConnectToWalletButtonHandler={ConnectToWalletButtonHandler} GetFriendList={GetFriendList} setTO={setTO} To={To} /></div>)
          :
          (<>{(Connected) ? (<CreateAccount ></CreateAccount>) : (<></>)}</>)
        }
        {
          Connected ?
            (<></>)
            :
            (<div>
              <Homepage ConnectToWalletButtonHandler={ConnectToWalletButtonHandler}></Homepage>
            </div>)
        }

      </>


    )
    :
    (<h1>Please Connect to Sepolia Newtork{ChainID}</h1>))
}

export default App
