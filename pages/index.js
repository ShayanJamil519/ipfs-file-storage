import { useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "../styles/Home.module.css";
import contractABI from "./abi.js";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";

const projectId = "";
const projectSecret = "";

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function Home() {
  const [selectedFile, setSelectedFile] = useState();
  const [ipfsHash, setIpfsHash] = useState();

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const file = selectedFile;
    const added = await ipfs.add(file);
    const ipfsHash = added.path;
    setIpfsHash(ipfsHash);
    // Connect to Ethereum network and instantiate the contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x9d849c2C993E800CB04784AA466cEb359f4c76B8",
      contractABI,
      signer
    );
    // Call the storeFile function of the contract and store the IPFS hash on the blockchain
    const tx = await contract.storeFile(ipfsHash);
    console.log("Tx" + tx);
    await tx.wait();
  };

  return (
    <>
      <Head>
        <title>Upload File to IPFS</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.content}>
          <h1>Upload a File to IPFS and Store Its Hash on the Blockchain</h1>
          <input type="file" onChange={handleFileInput} />
          <button onClick={handleUpload}>Upload</button>
          {ipfsHash && (
            <div>
              <p>IPFS Hash: {ipfsHash}</p>
              <a
                href={`https://ipfs.infura.io/ipfs/${ipfsHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View File on IPFS
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
