import React, { useEffect, useState } from "react";
import './App.css';
import abi from "./utils/WavePortal.json"
import { ethers } from "ethers";

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
  const contractAddress = '0xB9a9f4f998d0Aaceb0b18F6666edBB8E73598c42'
  const contractABI = abi.abi

  useEffect(() => {
    const getAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
    }
    getAccount()
  }, []);

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject()
      if (!ethereum) {
        alert("Get Metamask!")
        return
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      })

      console.log("wallet connected", accounts[0])
      setCurrentAccount(accounts[0])

    } catch (error) {
      console.error(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        console.log("total wave count: ", count.toNumber())
      } else {
        console.log('ethereum object does not exist on window')
      }
    }catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="main-container">
      <div className="data-container">
        <div className="header">
          Hello! 👋
        </div>
        <div className="bio">
          Connect your ethereum wallet and wave at me! {currentAccount}
        </div>
        <button className="waveButton" onClick={wave}>Wave at me</button>
        <button className="waveButton" onClick={connectWallet}>{currentAccount ? 'Wallet Connected!': 'Connect Wallet'}</button>
      </div>


    </div>
  );
}

export default App;
