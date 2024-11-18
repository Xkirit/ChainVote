'use client';

import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import VotingABI from "@/artifacts/contracts/Voting.sol/Voting.json";
import Image from 'next/image';

const ADMIN_ADDRESS = "0x4F7E7fDD48154aedc2E472F4706fEc3f75f1F7f9";
const CONTRACT_ADDRESS = "0xf2327Ca1c1c9e7d88Bd7ec7945D1B823417E0Bee";

interface Winner {
  name: string;
  voteCount: number;
  imageUrl: string;
}

export default function Admin() {
  const [userAddress, setUserAddress] = useState('');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      }
    };
    initializeUser();
  }, []);

  const getIPFSGatewayURL = (ipfsURL: string) => {
    if (!ipfsURL) return '';
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;
    return ipfsURL.replace('ipfs://', `https://${gateway}/ipfs/`);
  };

  const handleEndVoting = async () => {
    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingABI.abi,
        signer
      );

      // Get winner details before ending election
      const [winnerId, winnerName, winnerVotes] = await contract.getWinner();
      const [_, __, ___, imageUrl] = await contract.getCandidate(winnerId);

      // End the voting
      const loadingToastId = toast.loading("Ending voting session...");
      const tx = await contract.endVotingAndReset();
      await tx.wait();
      
      // Dismiss the loading toast
      toast.dismiss(loadingToastId);
      
      // Show winner dialog only after transaction is confirmed
      setWinner({
        name: winnerName,
        voteCount: Number(winnerVotes),
        imageUrl: imageUrl
      });

      toast.success("Voting ended successfully");
    } catch (error) {
      console.error("Error ending voting:", error);
      toast.error("Failed to end voting");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user is admin
  const isAdmin = userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="container mx-auto my-8 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Only the admin can access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen mx-auto p-4">
      <div className="flex justify-center items-center mt-10">
      <Button 
        onClick={handleEndVoting} 
        disabled={isProcessing}
        className="bg-red-500 hover:bg-red-700 disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : 'End Voting & Reset'}
      </Button>
    </div>
      {winner && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Election Winner</h2>
            
            {winner.imageUrl && (
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image 
                  src={getIPFSGatewayURL(winner.imageUrl)}
                  alt={winner.name}
                  fill
                  className="rounded-full object-cover"
                  unoptimized
                />
              </div>
            )}
            
            <p className="text-xl mb-2">{winner.name}</p>
            <p className="text-lg text-gray-600 mb-4">Total Votes: {winner.voteCount}</p>
            
            <Button 
              onClick={() => setWinner(null)}
              className="mt-4 bg-blue-500 hover:bg-blue-700"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}
