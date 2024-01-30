import Nav from "./component/Nav"
import { ethers } from "ethers";
import { abi } from "./abi/chat.json"
import { useEffect, useState } from "react";



const ContractAddress="0x717b0f1F331474fb444972E37BC1837eD7Cd05Fd";
const SepoliaChainId = 0xaa36a7;

function App() {

  const [Connected, SetConnected] = useState(false);
  const [Address, SetAddress] = useState("");
  const [ChainID, SetChainID] = useState("");
  const [Provider,Setprovider]=useState(null);
  // const [MyContract,SetMyContract]=useState(null);
  const[IsActiveUser,SetIsActiveUSer]=useState(false);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract=new ethers.Contract(ContractAddress,abi,provider);
  
  
   
  
 

  function handleAccountsChanged(accounts) {
    
    
      SetAddress(accounts[0]);
    
  }
  // const CheckUserExist=async()=>{
  //   return Array.from(await MyContract["ActiveUsers(address signer)"](signer))[0].length!==0;
  // }
  
  const ConnectToWalletButtonHandler = async () => {
    

      if (Connected == false) {
        let signer = await provider.getSigner();
        // SetMyContract(contract);
        // let bool =await contract["CheckUser(address)"](signer);
        let bool =Array.from(await contract["ActiveUsers(address signer)"](signer))[0].length!==0;
        // let bool=CheckUserExist();
        console.log(bool);
        // let frn="0x6607f7bB4942FBe54B17af9FF4ECbF23234e7C28"
        // let chk=await contract["CreateNewUser(string calldata)"]("shashank");
        // console.log(chk)
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
        SetAddress("");
      }
    
  }





  
  const NetworkConnected = async () => {

    // Setprovider( new ethers.BrowserProvider(window.ethereum))
    // SetMyContract(contract);
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    let accounts = await window.ethereum.request({ method: 'eth_accounts' }).then((e)=>{
      if(e.length!==0)
      {
        
        SetAddress(e[0]);
        SetConnected(true);
        // console.log(e);
      }
    }).catch((err) => {console.error(err);});
    SetChainID(chainId);
  }
  const MetaMaskListeners=()=>
  {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', (chainID) => { SetChainID(chainID) });

  }
  useEffect(() => { NetworkConnected() }, []);
  useEffect(()=>{MetaMaskListeners()},[]);


 

  





  return ((ChainID==SepoliaChainId)?(

  <>
    {/* <h1>{Provider}</h1> */} 
    <Nav ConnectToWalletButtonHandler={ConnectToWalletButtonHandler} Connected={Connected} Address={Address}></Nav>
  </>
  ):(<h1>Please Connect to Sepolia Newtork</h1>))
}

export default App
