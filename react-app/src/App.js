import React, { useEffect, useState } from "react";
import './App.css';

const getEthereumObject = () => window.ethereum; //metamask injects this in browser

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return
    }

    console.log("We have the ethereum object", ethereum)
    const accounts = await ethereum.request({ method: "eth_accounts" })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Authorized Account: ', account)
      return account
    } else {
      console.error("No authorized account found")
      return
    }

  } catch (error) {
    console.error(error)
    return
  }

}

function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account)
      }
    })
  }, [])

  return (
    <div className="main-container">
      <div className="data-container">
        <div className="header">
          Hello! 👋
        </div>
        <div className="bio">
          Connect your ethereum wallet and wave at me! {currentAccount}
        </div>
        <button className="waveButton" onClick={null}>Wave at me</button>

      </div>
    </div>
  );
}

export default App;
