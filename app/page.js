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

  const [selected, setSelected] =
    useState("");

  const [note, setNote] =
    useState("");

  const [notes, setNotes] =
    useState([]);

  async function connectWallet() {

    const accounts =
      await window.ethereum.request({

        method:
          "eth_requestAccounts"
      });

    setWallet(accounts[0]);

    const saved =
      JSON.parse(

        localStorage.getItem(
          "contracts"
        ) || "[]"
      );

    setContracts(saved);
  }

  async function deployContract() {

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

    alert(
      "DEPLOYED: " + address
    );
  }

  async function addNote() {

    const provider =
      new ethers.BrowserProvider(
        window.ethereum
      );

    const signer =
      await provider.getSigner();

    const contract =
      new ethers.Contract(

        selected,

        abi,

        signer
      );

    const tx =
      await contract.addNote(
        note
      );

    await tx.wait();

    loadNotes(selected);
  }

  async function loadNotes(
    address
  ) {

    const provider =
      new ethers.BrowserProvider(
        window.ethereum
      );

    const contract =
      new ethers.Contract(

        address,

        abi,

        provider
      );

    const result =
      await contract.getNotes();

    setNotes(result);

    setSelected(address);
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

      <div className="mb-10">

        <h2 className="text-3xl mb-4">

          Your Contracts

        </h2>

        <div className="flex flex-col gap-4">

          {

            contracts.map(
              (address, index) => (

                <div

                  key={index}

                  className="bg-gray-900 p-4 rounded-xl"

                >

                  <p>{address}</p>

                  <button

                    onClick={() =>
                      loadNotes(address)
                    }

                    className="bg-yellow-600 mt-2 px-4 py-2 rounded-xl"

                  >

                    Open

                  </button>

                </div>
              )
            )
          }

        </div>

      </div>

      {

        selected && (

          <div className="bg-gray-900 p-6 rounded-2xl">

            <h2 className="text-3xl mb-4">

              Notes

            </h2>

            <input

              value={note}

              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }

              placeholder="Write note..."

              className="text-black p-3 rounded-xl w-full mb-4"
            />

            <button

              onClick={addNote}

              className="bg-red-600 px-6 py-3 rounded-xl"

            >

              Add Note

            </button>

            <div className="mt-6 flex flex-col gap-4">

              {

                notes.map(
                  (n, i) => (

                    <div

                      key={i}

                      className="bg-black p-4 rounded-xl"

                    >

                      {n}

                    </div>
                  )
                )
              }

            </div>

          </div>
        )
      }

    </main>
  );
}
