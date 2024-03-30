import { useDispatch } from "react-redux";
import { useState } from "react";



import { SetUserExist } from "../store/UserExist";
import { SetUserName } from "../store/UserName";
import { GetContract } from "../Utils/Util";


const CreateAccount = () => {
    
    const [Txt,SetTxt]=useState("")
    const dis=useDispatch()
    
     
    
    const clickHandler= async ()=>{
        if (Txt.length>=3 && Txt.length<=32)
        {
            const contract =await GetContract();
            const txresponse=await contract["CreateNewUser(string calldata)"](Txt);
            const recept=await txresponse.wait();

            dis(SetUserExist(true));
            dis(SetUserName(Txt));
            
            
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