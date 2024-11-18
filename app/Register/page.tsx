"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Voting from '@/artifacts/contracts/Voting.sol/Voting.json';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';

const ADMIN_ADDRESS = "0x4F7E7fDD48154aedc2E472F4706fEc3f75f1F7f9";
const CONTRACT_ADDRESS = "0xf2327Ca1c1c9e7d88Bd7ec7945D1B823417E0Bee";

const uploadToPinata = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};

const CandidateRegistration = () => {
  const [votingContract, setVotingContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState('');
  const [candidateData, setCandidateData] = useState({
    name: '',
    age: '',
    party: '',
    imageUrl: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [electionTitle, setElectionTitle] = useState('');
  const [isElectionActive, setIsElectionActive] = useState(false);
  const [isStartingElection, setIsStartingElection] = useState(false);

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
          Voting.abi,
          signer
        );

        setVotingContract(contract);
        
      } catch (error) {
        console.error('Error initializing:', error);
        setRegistrationStatus('Failed to initialize: ' + error);
      }
    };

    initializeContract();
  }, []);

  useEffect(() => {
    const checkElectionStatus = async () => {
      if (votingContract) {
        const active = await votingContract.isElectionActive();
        setIsElectionActive(active);
        if (active) {
          const title = await votingContract.electionTitle();
          setElectionTitle(title);
        }
      }
    };

    checkElectionStatus();
  }, [votingContract]);

  const handleRegisterCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegistrationStatus('');

    try {
      if (!votingContract) {
        throw new Error("Contract not initialized");
      }

      if (userAddress.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
        throw new Error("Only admin can register candidates");
      }

      // Convert age to number
      const ageNumber = parseInt(candidateData.age);
      if (isNaN(ageNumber) || ageNumber < 18) {
        throw new Error("Invalid age - must be 18 or older");
      }

      const tx = await votingContract.addCandidate(
        candidateData.name,
        ageNumber,
        candidateData.party,
        candidateData.imageUrl,
        {
          gasLimit: 500000
        }
      );
      
      setRegistrationStatus('Registering candidate...');
      await tx.wait();
      setRegistrationStatus('Candidate registered successfully!');
      
      // Reset form
      setCandidateData({
        name: '',
        age: '',
        party: '',
        imageUrl: ''
      });
      setPreviewImage(null);

    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus(error as string);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsRegistering(true);
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        
        const ipfsUrl = await uploadToPinata(file);
        setCandidateData({ ...candidateData, imageUrl: ipfsUrl });
      } catch (error) {
        console.error('Error handling image:', error);
        toast.error('Failed to upload image');
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const handleStartElection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsStartingElection(true);
    try {
      if (!votingContract) throw new Error("Contract not initialized");
      if (!electionTitle.trim()) throw new Error("Election title is required");

      const tx = await votingContract.startElection(electionTitle);
      await tx.wait();
      setIsElectionActive(true);
      toast.success("Election started successfully!");
    } catch (error) {
      console.error("Error starting election:", error);
      toast.error(error as string || "Failed to start election");
    } finally {
      setIsStartingElection(false);
    }
  };

  // Check if user is admin
  const isAdmin = userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="container mx-auto my-8 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Only the admin can register candidates.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto p-4 max-w-md bg-background">
      {!isElectionActive && (
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          Election Management
        </h1>
      )}
      
      {!isElectionActive ? (
        <form onSubmit={handleStartElection} className="space-y-6 bg-card text-card-foreground p-8 rounded-lg shadow-lg mb-8 border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Election Title
            </label>
            <input
              type="text"
              value={electionTitle}
              onChange={(e) => setElectionTitle(e.target.value)}
              className="w-full px-4 py-2 border bg-background text-foreground border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter election title"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isStartingElection}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isStartingElection ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Starting Election...
              </>
            ) : (
              'Start Election'
            )}
          </Button>
        </form>
      ) : (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-8 border">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Current Election</h2>
          <p className="text-muted-foreground">{electionTitle}</p>
        </div>
      )}

      {isElectionActive && (
        <div className="min-h-screen mx-auto p-3 max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground bg-">Candidate Registration</h1>
          
          <form onSubmit={handleRegisterCandidate} className="space-y-6 bg-card text-card-foreground p-8 rounded-lg shadow-md border">
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative mb-4">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Candidate preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center border border-border">
                      <svg
                        className="w-12 h-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                
                <label className="cursor-pointer">
                  <span className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Upload Photo
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </label>
              </div>

              {/* Form Fields */}
              <div >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateData.name}
                  onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                  className="w-full px-4 py-2 border bg-background text-foreground border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={candidateData.age}
                  onChange={(e) => setCandidateData({...candidateData, age: e.target.value})}
                  className="w-full px-4 py-2 border bg-background text-foreground border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter age"
                  min="18"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Party Affiliation
                </label>
                <input
                  type="text"
                  value={candidateData.party}
                  onChange={(e) => setCandidateData({...candidateData, party: e.target.value})}
                  className="w-full px-4 py-2 border bg-background text-foreground border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter party name"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isRegistering ? 'Registering...' : 'Register Candidate'}
            </Button>

            {registrationStatus && (
              <div className={`p-4 rounded-md ${
                registrationStatus.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {registrationStatus}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CandidateRegistration;