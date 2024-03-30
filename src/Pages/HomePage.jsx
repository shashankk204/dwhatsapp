
const HomePage = ({ConnectToWalletButtonHandler}) => 
{
    
    return(
        <>
            <button className="bg-blue-300 rounded-lg p-1" onClick={ConnectToWalletButtonHandler}>
                {"connect"}
            </button>
        </>
    )

}

export default HomePage;