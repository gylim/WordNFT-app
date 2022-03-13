import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import miningGif from './assets/mining.gif';
import myEpicNft from './utils/MyEpicNFT.json';
import Particles from 'react-tsparticles';
import Popup from 'reactjs-popup';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = 'https://testnets.opensea.io/collection/celebsciencenft';
const CONTRACT_ADD = "0x997B39b338A6d0d7e37bC07571344B3A0588Dfed";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [minted, setMinted] = useState(0);
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  
  const particlesInit = (main) => {
      console.log(main);
  }
  const particlesLoaded = (container) => {
      console.log(container);
  }

  const checkWalletConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Pls install a web3 wallet!");
      return;
    } else {
      console.log("Ethereum object detected", ethereum);
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found account", account);
      setCurrentAccount(account);
    } else {
      console.log('No account found');
    }
  }

  const eventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADD, myEpicNft.abi, signer);
        contract.on("NewEpicNftMinted", (from, tokenId) => {
          alert(`We've minted your NFT and sent it to your wallet.
Do note that it may take up to 10 mins to show on OpenSea. The link is:
https://testnets.opensea.io/assets/${CONTRACT_ADD}/${tokenId.toNumber()}`)
        });
      } else {
        console.log("Ethereum object does not exist")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask!');
        return
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain" + chainId);
      const rinkebyId = "0x4";
      if (chainId !== rinkebyId) {
        alert("Pls switch to Rinkeby test net to mint NFT");
      }
      eventListener();
    } catch (error) {
      console.log(error);
    }
  }

  const getCount = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADD, myEpicNft.abi, signer);
        const total = await contract.totalMint();
        setMinted(total.toNumber());
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const mintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADD, myEpicNft.abi, signer);

        console.log("Paying fee")
        let nftTxn = await connectedContract.mint1NFT({ value: ethers.utils.parseEther('0.02') });

        setOpen(true);
        await nftTxn.wait();

        alert(`NFT created! See txn: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist")
      }
    } catch (error) {
      console.log(error)
    }
  }
    
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkWalletConnected();
  }, [])

  useEffect(() => {
    getCount();
  }, [minted])

  return (
    <div className="App">
    <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <div className="modal">
            <a className="close" onClick={closeModal}>&times;</a>
            <h3 className="content">Mining NFT in progress</h3>
            <img src={miningGif} className="pic" /> 
          </div>
    </Popup>
    <Particles id="tsparticles" init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 2,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 3,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }} 
        />
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Ben's NFT Collection</p>
          <p className="sub-text">
            What if celebrities became scientists? <br /><br /> Cost: 0.02 ETH each
          </p>
          {currentAccount === "" ? (renderNotConnectedContainer()) : (
            <button onClick={mintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
          <p className="sub-text"> {minted}/3000 NFTs minted so far</p>
          <p className="small">Click <a className="footer-text" href={OPENSEA_LINK}>Here</a> to view the collection on OpenSea</p>
        </div>
        
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;