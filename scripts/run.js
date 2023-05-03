const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); //compile contract and generate files in /artifacts/
    const waveContract = await waveContractFactory.deploy(); //create test local Ethereum network
    await waveContract.deployed() //wait for contract to be deployed on blockchain

    console.log("Contract deployed to: ", waveContract.address)
}

const runMain = async () => {
    try {
        await main();
        process.exit(0) //exit node process w/o error
    } catch (error) {
        console.log(error)
        process.exit(1) //exit node process while indicating 'Uncaught Fatal Exception' error
    }
}

runMain();
