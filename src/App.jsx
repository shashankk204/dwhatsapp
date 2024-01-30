import Nav from "./component/Nav"
import CreateAccount from "./component/CreateAccount";
import { ethers } from "ethers";
import { abi } from "./abi/chat.json"
import { useEffect, useState } from "react";



const ContractAddress = "0xd28CC42C8fC63A1929bE181A819ab412c1dAe9D1";
const SepoliaChainId = 0xaa36a7;

function App() {

  const [Connected, SetConnected] = useState(false);
  const [Address, SetAddress] = useState("");
  const [ChainID, SetChainID] = useState("");
  const [UserExist, SetUserExist] = useState(false);
  const provider = new ethers.BrowserProvider(window.ethereum);





  async function handleAccountsChanged(accounts) {
    SetAddress(accounts[0]);
    if (accounts.length != 0) {
      let x = await CheckUser()
      SetUserExist(x);
    }
  }

  const CheckUser = async () => {
    let signer = await provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, abi, signer);

    let bool = (await contract["CheckUser(address signer)"](signer));
    return (bool);
  }


  const ConnectToWalletButtonHandler = async () => {


    if (Connected == false) {
      let signer = await provider.getSigner();
      const contract = new ethers.Contract(ContractAddress, abi, signer);

      let bool = (await contract["CheckUser(address signer)"](signer));
      console.log(bool);
      // try {
      //   let frn = "0x2c42F77c751dd33EF4f3feE75D6D128B2fdA4569";
      //   let chk = (await contract["Addfriend(address)"](frn));
      //   console.log(chk);
      // }
      // catch (error) {
      //   console.log(error.revert.args[0]);
      // }
      // let res=await contract['allfriend']();
      // console.log(res);
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
        <Nav ConnectToWalletButtonHandler={ConnectToWalletButtonHandler} Connected={Connected} Address={Address}></Nav>
      {UserExist ? (<>chat</>) : (<CreateAccount></CreateAccount>)}
      </>


    ) :
    (<h1>Please Connect to Sepolia Newtork</h1>))
}

export default App
