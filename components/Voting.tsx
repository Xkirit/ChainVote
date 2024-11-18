"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingABI from '@/artifacts/contracts/Voting.sol/Voting.json';
import Image from 'next/image';

const ADMIN_ADDRESS = "0x4F7E7fDD48154aedc2E472F4706fEc3f75f1F7f9";
const CONTRACT_ADDRESS = "0xCa89Df34B2D4F6B5B75590f978D7D7e85915ef7F"; // Add your deployed contract address here

const VotingDapp = () => {
  const [votingContract, setVotingContract] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }

        // Connect to MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        console.log("Connected address:", address);
        console.log("Contract address:", CONTRACT_ADDRESS);

        // Initialize contract
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          VotingABI.abi,
          signer
        );

        setVotingContract(contract);

        // Check if user has voted
        try {
          const voted = await contract.hasUserVoted(address);
          console.log("Has voted:", voted);
          setHasVoted(voted);
        } catch (voteError) {
          console.error("Error checking vote status:", voteError);
        }

        // Fetch candidates
        await fetchCandidates(contract);

      } catch (error) {
        console.error("Error initializing:", error);
        
      }
    };

    initializeContract();
  }, []);

  const fetchCandidates = async (contractInstance) => {
    const contract = contractInstance || votingContract;
    if (!contract) return;

    try {
      const count = await contract.candidatesCount();
      console.log("Candidates count:", Number(count));
      const candidatesList = [];

      for (let i = 1; i <= Number(count); i++) {
        try {
          const [id, name, voteCount, imageUrl, _, party] = await contract.getCandidate(i);
          candidatesList.push({
            id: Number(id),
            name,
            voteCount: Number(voteCount),
            imageUrl,
            party
          });
        } catch (candidateError) {
          console.error(`Error fetching candidate ${i}:`, candidateError);
        }
      }

      setCandidates(candidatesList);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch candidates");
    }
  };

  const handleVote = async (candidateId) => {
    try {
      if (!votingContract) throw new Error("Contract not initialized");
      
      const tx = await votingContract.vote(candidateId, {
        gasLimit: 200000
      });
      
      await tx.wait();
      setHasVoted(true);
      await fetchCandidates(votingContract);
    } catch (error) {
      console.error("Error voting:", error);
      setError(error.message);
    }
  };

  const isAdmin = userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  const getIPFSGatewayURL = (ipfsURL: string) => {
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    return ipfsURL.replace('ipfs://', `https://${gateway}/ipfs/`);
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl font-serif text-white font-bold mb-4 text-center">VOTING DAPP</h1>
      
      {userAddress && (
        <div className="fixed top-0 right-0 p-4">
          <span className="text-gray-600 block">
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="border rounded-lg p-4 shadow bg-white">
            {candidate.imageUrl && (
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src={getIPFSGatewayURL(candidate.imageUrl)}
                  alt={candidate.name}
                  fill
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
            )}
            <h3 className="text-xl font-semibold">{candidate.name}</h3>
            <p className="text-gray-600">{candidate.party}</p>
            <p className="text-gray-500">Votes: {candidate.voteCount}</p>
            
            <button
              onClick={() => handleVote(candidate.id)}
              disabled={hasVoted}
              className={`mt-4 w-full py-2 px-4 rounded ${
                hasVoted 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {hasVoted ? 'Already Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingDapp;