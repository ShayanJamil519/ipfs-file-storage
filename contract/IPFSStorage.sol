// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract IPFSStorage {
    mapping(string => bool) fileHashes;
    
    event FileStored(string ipfsHash, address indexed uploader);
    
    function storeFile(string memory ipfsHash) public {
        require(!fileHashes[ipfsHash], "File with the same IPFS hash already exists.");
        fileHashes[ipfsHash] = true;
        emit FileStored(ipfsHash, msg.sender);
    }
    
    function checkFileExistence(string memory ipfsHash) public view returns (bool) {
        return fileHashes[ipfsHash];
    }
}
