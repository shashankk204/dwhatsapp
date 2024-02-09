import { ethers } from "ethers";
import { useEffect, useState } from "react";

const Nav = ({Name,ConnectToWalletButtonHandler,Connected,}) => {
    
    return (
        <>
            <button className="bg-blue-400 rounded-md p-4" onClick={ConnectToWalletButtonHandler}>
        {(Connected) ?`disconnect:-${Name} ` : "connect"}
      </button>
        </>
    )

}

export default Nav;