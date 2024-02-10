import { useSelector } from "react-redux";

const Nav = ({ConnectToWalletButtonHandler}) => {
    const Name=useSelector(state=>state.UserName.value);
    const Connected=useSelector(state=>state.Connected.value)
    return (
        <>
            <button className="bg-blue-300 rounded-lg p-1" onClick={ConnectToWalletButtonHandler}>
        {(Connected==true) ?`disconnect:-${Name} ` : "connect"}
      </button>
        </>
    )

}

export default Nav;