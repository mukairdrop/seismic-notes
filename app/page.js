"use client";

import { useState } from "react";
import { ethers } from "ethers";

const abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "note",
        "type": "string"
      }
    ],
    "name": "addNote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "note",
        "type": "string"
      }
    ],
    "name": "NoteAdded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getNotes",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "notes",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const bytecode =
  "[object Object]";

export default function Home() {

  const [wallet, setWallet] =
    useState("");

  const [contracts, setContracts] =
    useState([]);

  const [status, setStatus] =
    useState("Ready");

  async function connectWallet() {

    try {

      if(!window.ethereum) {

        alert(
          "Install Rabby"
        );

        return;
      }

      const accounts =
        await window.ethereum.request({

          method:
            "eth_requestAccounts"
        });

      setWallet(accounts[0]);

      setStatus(
        "Wallet Connected"
      );

    } catch(err) {

      console.log(err);

      setStatus(
        "Wallet Connection Failed"
      );
    }
  }

  async function deployContract() {

    try {

      setStatus(
        "Deploying..."
      );

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const signer =
        await provider.getSigner();

      const factory =
        new ethers.ContractFactory(

          abi,

          bytecode,

          signer
        );

      const contract =
        await factory.deploy();

      setStatus(
        "Waiting for confirmation..."
      );

      await contract.waitForDeployment();

      const address =
        await contract.getAddress();

      const updated = [

        ...contracts,

        address
      ];

      setContracts(updated);

      localStorage.setItem(

        "contracts",

        JSON.stringify(updated)
      );

      setStatus(
        "DEPLOYED: " + address
      );

    } catch(err) {

      console.log(err);

      setStatus(
        "ERROR: " + err.message
      );
    }
  }

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl mb-8">

        Seismic Notes

      </h1>

      <div className="flex gap-4 mb-8">

        <button

          onClick={connectWallet}

          className="bg-blue-600 px-6 py-3 rounded-xl"

        >

          {

            wallet

            ?

            "Connected"

            :

            "Connect Wallet"
          }

        </button>

        <button

          onClick={deployContract}

          className="bg-green-600 px-6 py-3 rounded-xl"

        >

          Deploy Notes Contract

        </button>

      </div>

      <div className="bg-gray-900 p-6 rounded-xl">

        <p>Status:</p>

        <p className="mt-2 text-green-400">

          {status}

        </p>

      </div>

      <div className="mt-10">

        {

          contracts.map(
            (c, i) => (

              <div
                key={i}
                className="bg-gray-800 p-4 rounded-xl mt-4"
              >

                {c}

              </div>
            )
          )
        }

      </div>

    </main>
  );
}
