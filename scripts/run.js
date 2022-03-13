const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('WordNFT');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log('Contract deployed at:', nftContract.address);

    let txn = await nftContract.mint1NFT({ value: hre.ethers.utils.parseEther('0.02') });
    await txn.wait();

    let total = await nftContract.totalMint();
    console.log(`A total of ${total.toNumber()}/2 NFTs have been minted`);

    /* see if insufficient eth error message shows */
    // txn = await nftContract.mint1NFT();
    // await txn.wait();

    txn = await nftContract.mint1NFT({ value: hre.ethers.utils.parseEther('0.02') });
    await txn.wait();

    total = await nftContract.totalMint();
    console.log(`A total of ${total.toNumber()}/2 NFTs have been minted`);

    /* test if max supply limit is effective */
    txn = await nftContract.mint1NFT({ value: hre.ethers.utils.parseEther('0.02') });
    await txn.wait();

    const [owner, randomPerson] = await hre.ethers.getSigners();

    /* test if other wallet can withdraw funds */
    // let wd = await nftContract.connect(randomPerson).withdraw();
    // await wd.wait();

    wd = await nftContract.connect(owner).withdraw();
    await wd.wait();
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();