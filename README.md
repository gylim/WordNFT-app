# NFT Project from buildspace

This project is built on Solidity and React, using the code base provided by buildspace, with a few key modifications to the contract and app. App is deployed at: https://nft-starter-project.bengylim.repl.co 

## WordNFT.sol contract
- Hard coded max supply and price into the contract as constants
- Implemented checks on user wallet balance and total NFTs minted before allowing further minting
- Added totalMint() function to track how many NFTs have been minted
- Added withdraw() function to allow contract owner to withdraw earnings

## App.jsx React App
- Used react-tsparticles package to create dynamic animated background
- Used reactjs-popup to implement popup informing user that mining of NFT is in progress
- Frontend UI shows NFTs minted to date
- Inclusion of link to OpenSea collection