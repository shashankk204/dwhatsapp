import Nav from "./component/Nav"
import CreateAccount from "./component/CreateAccount";
import { ethers } from "ethers";
import { abi } from "./abi/chat.json"
import { useEffect, useState } from "react";
import {ContractAddress,SepoliaChainId} from "./assets/contants"
import MainPage from "./component/MainPage";
import { SetAddress } from "./store/Address";
import {useDispatch,useSelector} from "react-redux";
import { SetConnected } from "./store/Connected";
import { SetUserExist } from "./store/UserExist";
import { SetUserName } from "./store/UserName";
import { SetFriendList,EmptyFriendList } from "./store/FriendList";
import { SetActive } from "./store/Active";
import { EmptyallMessage } from "./store/allMessage";
function App() {
  const Dispatch=useDispatch();
  const Connected=useSelector(state=>state.Connected.value);
  const [ChainID, SetChainID] = useState("");
  const UserExist=useSelector(state=>state.UserExist.value);
  const [To,setTO]=useState("")
  const provider = new ethers.BrowserProvider(window.ethereum);
   


  // const[FriendList,SetfriendList]=useState([])
  // const[allMessage,SetallMessage]=useState([]);
  



  
  
  
  
  const GetFriendList= async ()=>{
    const signer=await provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    const txn=await contract.allfriend();
    Dispatch(EmptyFriendList());
    
    Array.from(txn).forEach(async (e)=>
    {
      let name=await contract.GetUserName(e)
      let id=e;
      let obj={}
      obj[id]=name
      Dispatch(SetFriendList(obj));
    })
    console.log("ended")
    // console.log()
    // Dispatch(SetFriendList(Array.from(txn)));     

    
    
    // SetfriendList( Array.from(txn));
    
  } 
  const CheckUser = async () => {
    let signer = await provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, provider);
    let bool =await contract.CheckUser(signer);
    if(bool)
    {
      const Name=await contract.GetUserName(signer);
      Dispatch(SetUserName(Name));
    }
    return (bool);
  }
  
  
  const ConnectToWalletButtonHandler = async () => {
    
    
    if (Connected == false) {
      let signer = await provider.getSigner();
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
    if (accounts.length != 0) {
      let x = await CheckUser()
      Dispatch(SetUserExist(x));
      if(x==true)
      {

        await GetFriendList();
        Dispatch(EmptyallMessage());
        Dispatch(SetActive(""));
      }
    }
  }

  const NetworkConnected = async () => {


    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    let accounts = await window.ethereum.request({ method: 'eth_accounts' }).then(async (e) => {
      if (e.length !== 0) {

        Dispatch(SetAddress(e[0]));
        Dispatch(SetConnected(true));
        let x = await CheckUser();
        Dispatch(SetUserExist(x))
      }
    }).catch((err) => { console.error(err); });
    SetChainID(chainId);
  }
  
  useEffect(() => { NetworkConnected() }, []);
  useEffect(
    ()=>{
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', (chainID) => { SetChainID(chainID) });

    return ()=>{
      window.ethereum.off('accountsChanged', handleAccountsChanged);
      window.ethereum.off('chainChanged', (chainID) => { SetChainID(chainID) });
  
    }
    },[]
  )
  // useEffect(() => { MetaMaskListeners() }, []);










  return ((ChainID == SepoliaChainId) ?
    (

      <>
     
      
        {(UserExist)?
          (<div><MainPage  GetFriendList={GetFriendList} setTO={setTO} To={To} provider={provider}/></div>)
          :
          (<>{(Connected)?(<CreateAccount provider={provider}></CreateAccount>):(<></>)}</>)
        }
        <div>
          <Nav ConnectToWalletButtonHandler={ConnectToWalletButtonHandler}></Nav>
        </div>
      
      </>


    ) 
    :
    (<h1>Please Connect to Sepolia Newtork{ChainID}</h1>))
}

export default App
