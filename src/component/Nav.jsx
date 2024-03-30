import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { GetSigner, GetContract } from "../Utils/Util";

import { SetAddress } from "../store/Address";
import { SetConnected } from "../store/Connected";
import { SetUserExist } from "../store/UserExist";
import { SetUserName } from "../store/UserName";

const Nav = () => {
  const navigate = useNavigate();

  const Name = useSelector(state => state.UserName.value);
  const Dispatch = useDispatch();
  const Connected = useSelector(state => state.Connected.value);


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
      navigate('/');
    }

  }
  return (
    <>
      <button className="bg-blue-300 rounded-lg p-1" onClick={ConnectToWalletButtonHandler}>
        {(Connected == true) ? `disconnect:-${Name} ` : "connect"}
      </button>
    </>
  )

}

export default Nav;