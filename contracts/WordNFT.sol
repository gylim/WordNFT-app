// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";

// inherit the imported contract's methods etc
contract WordNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter; // keep track of token ID
    Counters.Counter private _tokenIds; // state variable stored on contract
    uint public constant MAX_SUPPLY = 3000;
    uint public constant PRICE = 0.02 ether;

    // basic variable transferrable across NFTs
    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWords = ["Winfrey's", "Hank's", "Kardashian's", "Lawrence's", "Smith's", "Johnson's", "Aniston's", "Downey Jr's", "Washington's", "Pitt's", "Robert's", "Bieber's", "Jolie's", "Clooney's", "DiCaprio's"];
    string[] secondWords = ["Previous", "Impartial", "Difficult", "Warlike", "Naive", "General", "Spurious", "Flippant", "Clever", "Roomy", "Puny", "Flaky", "Zealous", "Silly", "Righteous"];
    string[] thirdWords = ["BigBang", "CosmicExpansion", "Gravitation", "Motion", "Thermodynamics", "Buoyancy", "Natural Selection", "Relativity", "PartialPressure", "FluidDynamics", "Conduction", "Uncertainty", "QuantumFields", "String", "Information"];

    event NewEpicNftMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("CelebScienceNFT", "WORDS^3") {
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function randFirst(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstWords.length; // squash the num btw 0 & array.length
        return firstWords[rand];
    }

    function randSecond(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length; // squash the num btw 0 & array.length
        return secondWords[rand];
    }

    function randThird(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length; // squash the num btw 0 & array.length
        return thirdWords[rand];
    }

    function mint1NFT() public payable {
        uint256 newItemId = _tokenIds.current(); // get current ID
        require((newItemId + 1) <= MAX_SUPPLY, "Sold Out!");
        require(msg.value >= PRICE, "Insufficient ether to mint");

        // randomly select words from arrays and combine into final svg
        string memory first = randFirst(newItemId);
        string memory second = randSecond(newItemId);
        string memory third = randThird(newItemId);
        string memory combined = string(abi.encodePacked(first, second, third));
        string memory finalSvg = string(abi.encodePacked(baseSvg, combined, "</text></svg>"));
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', combined, 
                        '", "description": "Random collection of words", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),'"}'
                    )
                )
            )
        );

        string memory finalURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(msg.sender, newItemId); // mint NFT

        _setTokenURI(newItemId, finalURI); // set NFT data
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

        _tokenIds.increment(); // increase ID counter

        emit NewEpicNftMinted(msg.sender, newItemId); // trigger event
    }

    function withdraw() public payable onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ether to withdraw");
        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed");
    }

    function totalMint() public view returns (uint256) {
        return (_tokenIds.current());
    }
}