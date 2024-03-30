import { ethers } from "ethers";

import { abi } from "../abi/chat.json"
import { ContractAddress } from "../assets/contants"


const provider = new ethers.BrowserProvider(window.ethereum);


export const GetContract=async ()=>
{
    const signer = await provider.getSigner();
    return new ethers.Contract(ContractAddress, abi, signer);
}



export const GetSigner=async ()=>
{
    const signer = await provider.getSigner();
    return signer;
}


export const GetContractWithOutSigner=()=>{
    return new ethers.Contract(ContractAddress,abi,provider);
    
}