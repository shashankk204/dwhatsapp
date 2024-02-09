import Nav from "./component/Nav"
import CreateAccount from "./component/CreateAccount";
import { ethers } from "ethers";
import { abi } from "./abi/chat.json"
import { useEffect, useState } from "react";
import {ContractAddress,SepoliaChainId} from "./assets/contants"
import MainPage from "./component/MainPage";

  


function App() {

  const [Connected, SetConnected] = useState(false);
  const [Address, SetAddress] = useState("");
  const [ChainID, SetChainID] = useState("");
  const [UserExist, SetUserExist] = useState(false);
  const[FriendList,SetfriendList]=useState([])
  const[Active,SetActive]=useState("");    
  const[allMessage,SetallMessage]=useState([]);
  const[UserName,SetUserName]=useState("");
  const [To,setTO]=useState("")
  const provider = new ethers.BrowserProvider(window.ethereum);



  const FriendsName={};


  async function handleAccountsChanged(accounts) {
    setTO("");
    SetAddress(accounts[0]);
    SetUserName("")
    if (accounts.length != 0) {
      let x = await CheckUser()
      SetUserExist(x);
      if(x==true)
      {

        await GetFriendList();
        SetallMessage([]);
        SetActive("");
      }
    }
  }

 
  const GetFriendList= async ()=>{
    const signer=await provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, signer);
    // const friendList= await contract["allfriend()"]();
    const txn=await contract.allfriend();
     Array.from(txn).forEach(async (e)=>
    {
      FriendsName[e]=await contract.GetUserName(e)
    })     
    console.log(FriendsName)
    
    
    SetfriendList( Array.from(txn));
     
} 
  const CheckUser = async () => {
    let signer = await provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, provider);
    let bool =await contract.CheckUser(signer);
    if(bool)
    {
      const Name=await contract.GetUserName(signer);
      SetUserName(Name);
    }
    return (bool);
  }


  const ConnectToWalletButtonHandler = async () => {


    if (Connected == false) {
      let signer = await provider.getSigner();
      let Uexsits = await CheckUser();
      console.log(Uexsits);
      SetUserExist(Uexsits);



      let walletAddress = await signer.getAddress();
      SetAddress(walletAddress);
      SetConnected(true);
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


      SetConnected(false);
      SetUserExist(false);
      SetAddress("");
    }

  }






  const NetworkConnected = async () => {


    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    let accounts = await window.ethereum.request({ method: 'eth_accounts' }).then(async (e) => {
      if (e.length !== 0) {

        SetAddress(e[0]);
        SetConnected(true);
        let x = await CheckUser();
        SetUserExist(x)

        // console.log(e);
      }
    }).catch((err) => { console.error(err); });
    SetChainID(chainId);
  }
  const MetaMaskListeners = () => {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', (chainID) => { SetChainID(chainID) });

  }
  useEffect(() => { NetworkConnected() }, []);
  useEffect(() => { MetaMaskListeners() }, []);










  return ((ChainID == SepoliaChainId) ?
    (

      <>
        <Nav ConnectToWalletButtonHandler={ConnectToWalletButtonHandler} Connected={Connected} Name={UserName}  ></Nav>
        {(UserExist)?(<MainPage To={To} setTO={setTO} Address={Address} FriendList={FriendList} GetFriendList={GetFriendList} SetfriendList={SetfriendList} provider={provider} SetActive={SetActive} Active={Active} allMessage={allMessage} FriendsName={FriendsName} SetallMessage={SetallMessage}/>):(<CreateAccount SetUserName={SetUserName} provider={provider}   SetUserExist={SetUserExist}></CreateAccount>)}
        
      </>


    ) :
    (<h1>Please Connect to Sepolia Newtork{ChainID}</h1>))
}

export default App
