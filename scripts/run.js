const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); //compile contract and generate files in /artifacts/
    const waveContract = await waveContractFactory.deploy(); //create test local Ethereum network
    await waveContract.deployed() //wait for contract to be deployed on blockchain

    console.log("Contract deployed to: ", waveContract.address)
    console.log("Contract deployed by: ", owner.address)

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber())

    //send test waves
    let waveTxn = await waveContract.wave("a message!")
    await waveTxn.wait() //wait for transaction to be mined
    waveTxn = await waveContract.connect(randomPerson).wave("Another message")
    await waveTxn.wait()

    let allWaves = await waveContract.getAllWaves()
    console.log(allWaves)


    // const firstWaveTxn = await waveContract.wave()
    // await firstWaveTxn.wait()

    // await waveContract.getTotalWaves();


    // const secondWaveTxn = await waveContract.connect(randomPerson).wave()
    // await secondWaveTxn.wait()

    // await waveContract.getTotalWaves();
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
