"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingABI from '@/artifacts/contracts/Voting.sol/Voting.json';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const ADMIN_ADDRESS = "0x4F7E7fDD48154aedc2E472F4706fEc3f75f1F7f9";
const CONTRACT_ADDRESS = "0xf2327Ca1c1c9e7d88Bd7ec7945D1B823417E0Bee";

const VotingDapp = () => {
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [electionTitle, setElectionTitle] = useState('');
  const [isElectionActive, setIsElectionActive] = useState(false);

  const fetchElectionDetails = async (contract: ethers.Contract) => {
    try {
      const active = await contract.isElectionActive();
      setIsElectionActive(active);
      
      if (active) {
        const title = await contract.electionTitle();
        console.log("Election Title:", title); // Debug log
        setElectionTitle(title);
      }
    } catch (error) {
      console.error("Error fetching election details:", error);
    }
  };

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          VotingABI.abi,
          signer
        );

        setVotingContract(contract);

        // Fetch election details
        await fetchElectionDetails(contract);

        // Check if user has voted
        const voted = await contract.hasUserVoted(address);
        setHasVoted(voted);

        // Fetch candidates
        await fetchCandidates(contract);

      } catch (error) {
        console.error("Error initializing:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    initializeContract();
  }, []);

  const fetchCandidates = async (contractInstance: ethers.Contract | null) => {
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

  const handleVote = async (candidateId: number) => {
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
      setError(error as string);
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
    <div className="container mx-auto px-4 py-8 bg-background">
      {isElectionActive ? (
        <>
          {electionTitle && (
            <div className="text-center mb-12">
              <h1 className="text-4xl font-serif text-foreground font-bold">
                {electionTitle}
              </h1>
              <div className="mt-2 text-gray-300">
                Active Election
              </div>
            </div>
          )}
          
          <div className="fixed bottom-4 right-4 bg-green-500/10 text-green-500 px-4 py-2 rounded-full border border-green-500/20 font-medium flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Election Live
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-card text-card-foreground border rounded-lg p-4 shadow">
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
                <h3 className="text-xl font-semibold text-foreground">{candidate.name}</h3>
                <p className="text-muted-foreground">{candidate.party}</p>
                <p className="text-muted-foreground">Votes: {candidate.voteCount}</p>
                
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={hasVoted}
                  
                  className={`mt-4 w-full py-2 px-4 rounded-lg ${
                    hasVoted 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {hasVoted ? 'Already Voted' : 'Vote'}
                </button>
              </div>
            ))}
          </div>

          {candidates.length === 0 && (
            <div className="text-center text-gray-300 mt-8">
              No candidates registered yet.
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-white">
          <h1 className="text-4xl text-foreground font-bold mb-4">No Active Election</h1>
          <p className="text-foreground">
            Please wait for an election to be started by the administrator.
          </p>
        </div>
      )}
    </div>
  );
};

export default VotingDapp;