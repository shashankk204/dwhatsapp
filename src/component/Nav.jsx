import { ethers } from "ethers";
import { useEffect, useState } from "react";

const Nav = ({Address,ConnectToWalletButtonHandler,Connected}) => {
    
    return (
        <>
            <button className="bg-blue-400 rounded-md p-4" onClick={ConnectToWalletButtonHandler}>
        {(Connected) ?`disconnect:-${Address}` : "connect"}
      </button>
        </>
    )

}

export default Nav;