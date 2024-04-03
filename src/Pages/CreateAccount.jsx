import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { SetUserExist } from "../store/UserExist";
import { SetUserName } from "../store/UserName";
import { GetContract, GetSigner } from "../Utils/Util";


const CreateAccount = () => {

    const [Txt, SetTxt] = useState("")
    const dis = useDispatch()
    const navigate = useNavigate();



    const clickHandler = async () => {
        if (Txt.length >= 3 && Txt.length <= 32) {
            const contract = await GetContract();
            const txresponse = await contract["CreateNewUser(string calldata)"](Txt);
            const recept = await txresponse.wait();
            dis(SetUserExist(true));
            dis(SetUserName(Txt));
            if (recept) {
                navigate('/main');
            }


        }
        else {
            alert("Nikename must be longer than 3 and shorter than 32");
        }
    }


    const CheckUserExist = async () => {
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
            let signer = await GetSigner();
            const contract = await GetContract();
            let bool = await contract.CheckUser(signer);
            if (bool) {
                console.log("hello")
                navigate('/main');
            }
        }
        else {
            navigate('/');
        }

    }
    useEffect(() => {
        CheckUserExist();

    }, [])


    return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'rgb(131,58,180)', background: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(146,37,37,1) 50%, rgba(252,176,69,1) 100%)' }}>
        <h1 style={{ color: 'black', marginBottom: '20px', fontSize: '30px', fontWeight: 'bold' }}>Create Account</h1>
        <input type="text" name="Give Name" value={Txt} onChange={(e) => { SetTxt(e.target.value) }} placeholder="Nicename" style={{ padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none' }} />
        <input type="button" value="Create Account" onClick={clickHandler} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#4CAF50', color: 'white', cursor: 'pointer' }} />
    </div>
    )
}





export default CreateAccount
