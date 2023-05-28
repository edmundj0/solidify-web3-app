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
  const [userMessage, setUserMessage] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = '0xa7b79E516C2B0778Ce0D8d34d462Bb6aA67F5fdF'
  const contractABI = abi.abi

  useEffect(() => {
    const getAccount = async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
        getAllWaves()
      }
    }
    getAccount()
  }, []);

  //listen for emitter events
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message)
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message
        }
      ])
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      wavePortalContract.on("NewWave", onNewWave)
    }

    return () => {
      if(wavePortalContract){
        wavePortalContract.off("NewWave", onNewWave)
      }
    }
  }, [])

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        //call method from smart contract
        const waves = await wavePortalContract.getAllWaves()

        let wavesCleaned = []
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          })
        })
        setAllWaves(wavesCleaned)
      }
      else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  const wave = async (e) => {
    e.preventDefault()
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        console.log("total wave count: ", count.toNumber())

        //execute actual wave

        const waveTxn = await wavePortalContract.wave(String(userMessage), { gasLimit: 300000 })
        console.log("Mining...", waveTxn.hash)

        await waveTxn.wait()
        console.log("Mined --", waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        console.log("total wave count...", count.toNumber())
        getAllWaves()

      } else {
        console.log('ethereum object does not exist on window')
      }
    } catch (error) {
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

        <form className="form-wrapper" onSubmit={wave}>
          <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Enter message:" />
          <button className="waveButton" type="submit">Send me a message!</button>
        </form>

        <button className="waveButton" onClick={connectWallet}>{currentAccount ? 'Wallet Connected!' : 'Connect Wallet'}</button>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>


    </div>
  );
}

export default App;
