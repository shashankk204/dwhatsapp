import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { SetUserExist } from "../store/UserExist";
import { SetUserName } from "../store/UserName";
import { GetContract, GetSigner } from "../Utils/Util";


const CreateAccount = () => {
    
    const [Txt,SetTxt]=useState("")
    const dis=useDispatch()
    const navigate = useNavigate();
    
     
    
    const clickHandler= async ()=>{
        if (Txt.length>=3 && Txt.length<=32)
        {
            const contract =await GetContract();
            const txresponse=await contract["CreateNewUser(string calldata)"](Txt);
            const recept=await txresponse.wait();
            dis(SetUserExist(true));
            dis(SetUserName(Txt));
            if(recept)
            {
                navigate('/main');
            }
            
            
        }
        else
        {
            alert("Nikename must be longer than 3 and shorter than 32");
        }
    }


    const CheckUserExist=async ()=>
    {
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if(accounts.length !== 0)
        {
            let signer = await GetSigner();
            const contract = await GetContract();
            let bool = await contract.CheckUser(signer);
            if(bool)
            {
                console.log("hello")
                navigate('/main');
            }
        }
        else
        {
            navigate('/');
        }

    }
    useEffect(()=>{
        CheckUserExist();

    },[])


    return (<>
        <h1>Create Account</h1>
        <input type="text" name="Give Name" value={Txt} onChange={(e)=>{SetTxt(e.target.value)}} placeholder="Nicename" />
        <input type="button" value="Create Account" onClick={clickHandler}/>
    </>)
}





export default CreateAccount