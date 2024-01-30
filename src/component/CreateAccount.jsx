import { useState } from "react"




const CreateAccount = () => {
    const[Nikename,SetNikename]=useState("");

    const clickHandler=()=>{
        if (Nikename.length>=3 && Nikename.length<=32)
        {
            // have to
        }
        else
        {
            alert("Nikename must be longer than 3 and shorter than 32");
        }
    }



    return (<>
        <h1>Create Account</h1>
        <input type="text" name="Give Name" value={Nikename} onChange={(e)=>{SetNikename(e.target.value)}} placeholder="Nicename" />
        <input type="button" value="Create Account" onClick={clickHandler}/>
    </>)
}





export default CreateAccount