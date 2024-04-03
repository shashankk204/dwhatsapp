import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { GetSigner, GetContract } from "../Utils/Util";

import { SetAddress } from "../store/Address";
import { SetConnected } from "../store/Connected";
import { SetUserExist } from "../store/UserExist";
import { SetUserName } from "../store/UserName";



const HomePage = () => {
    const navigate = useNavigate();
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
            if (Uexsits) {
                navigate("/main");
            }
            else {
                navigate('/signup')
            }
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
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'rgb(131,58,180)', background: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(146,37,37,1) 50%, rgba(252,176,69,1) 100%)' }}>
                <button className="bg-gray-500 rounded-lg p-4" onClick={ConnectToWalletButtonHandler}>
                    {"Launch App"}
                </button>
            </div>

        </>
    )

}

export default HomePage;
