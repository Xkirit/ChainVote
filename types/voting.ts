import { Contract } from "ethers";
import { ethers } from "ethers";

export interface Candidate {
    id: number;
    name: string;
    voteCount: number;
    imageUrl: string;
    age: number;
    party: string;
}

export interface VotingContractState {
    contract: ethers.Contract | null;
    isAdmin: boolean;
    isConnected: boolean;
    address: string | null;
} 