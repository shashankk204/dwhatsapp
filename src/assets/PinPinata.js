import axios from "axios" 
import fs from "fs"
import FormData from "form-data";
import {JWT} from "./const.js";


const JWT_KEY=`Bearer ${JWT}`

export const pinFileToIPFS = async (file) => {
    const formData = new FormData();

   
    
    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({name: "Chat",});
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT_KEY
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}




export const pinStringToIPFS = async (obj) => {
    try {
     const data = new FormData()
     data.append('file',JSON.stringify(obj), {
        filepath: "string.JSON"
      })
     const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        headers: {
          'Authorization': JWT_KEY
        }
      })
     console.log(res.data)
    } catch (error) {
     console.log(error.response) 
    }
  }