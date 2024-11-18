'use client';

import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import VotingABI from "@/artifacts/contracts/Voting.sol/Voting.json";
import Image from 'next/image';
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

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
  const { width, height } = useWindowSize()

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
          <Confetti
            width={width}
            height={height}
            recycle={true}
            numberOfPieces={200}
          />
          <div className="bg-card text-card-foreground p-8 rounded-lg shadow-xl text-center max-w-md w-full animate-bounce-slow">
            <div className="relative">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <span className="text-6xl">👑</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
                Winner Announced!
              </h2>
              
              {winner.imageUrl && (
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 animate-pulse-slow rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-1">
                    <Image 
                      src={getIPFSGatewayURL(winner.imageUrl)}
                      alt={winner.name}
                      fill
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-2xl font-bold text-foreground">{winner.name}</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl">🏆</span>
                  <p className="text-xl text-foreground/80">
                    {winner.voteCount} {winner.voteCount === 1 ? 'Vote' : 'Votes'}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => setWinner(null)}
                className="mt-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 
                  hover:from-yellow-500 hover:via-red-600 hover:to-pink-600 
                  text-white font-bold py-3 px-6 rounded-full transform transition-all
                  hover:scale-105 active:scale-95"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}
