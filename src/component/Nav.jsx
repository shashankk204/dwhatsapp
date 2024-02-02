import { ethers } from "ethers";
import { useEffect, useState } from "react";

const Nav = ({Address,ConnectToWalletButtonHandler,Connected,Nikename}) => {
    
    return (
        <>
            <button className="bg-blue-400 rounded-md p-4" onClick={ConnectToWalletButtonHandler}>
        {(Connected) ?`disconnect:-${Address} ${Nikename}` : "connect"}
      </button>
        </>
    )

}

export default Nav;