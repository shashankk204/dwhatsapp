import { useState } from "react";
import { Contract, ethers } from "ethers";
import {abi} from "../abi/chat.json";
import {ContractAddress} from "../assets/contants"

const CreateAccount = ({provider,SetUserExist,SetUserName}) => {
    
    const [Txt,SetTxt]=useState("")
    
    
     
    
    const clickHandler= async ()=>{
        if (Txt.length>=3 && Txt.length<=32)
        {
            const signer=await provider.getSigner();
            const contract =new ethers.Contract(ContractAddress, abi, signer);
            const txresponse=await contract["CreateNewUser(string calldata)"](Txt);
            const recept=await txresponse.wait();
            // console.log(recept);

            SetUserExist(true);
            SetUserName(Txt);
            
            
        }
        else
        {
            alert("Nikename must be longer than 3 and shorter than 32");
        }
    }



    return (<>
        <h1>Create Account</h1>
        <input type="text" name="Give Name" value={Txt} onChange={(e)=>{SetTxt(e.target.value)}} placeholder="Nicename" />
        <input type="button" value="Create Account" onClick={clickHandler}/>
    </>)
}





export default CreateAccount