"use client";

import React from 'react';
import { useVotingContract } from '@/hooks/useVotingContract';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AdminDashboard: React.FC = () => {
  const { contract, isAdmin, isConnected } = useVotingContract();
  const router = useRouter();

  const handleEndVoting = async () => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      if (!isAdmin) throw new Error("Only admin can perform this action");

      const tx = await contract.endVotingAndReset({
        gasLimit: 200000
      });

      toast.loading("Ending voting session...");
      await tx.wait();
      toast.success("Voting session ended and reset successfully");
      
      router.refresh();
    } catch (error: any) {
      console.error("Error ending voting:", error);
      toast.error(error.message || "Failed to end voting");
    }
  };

  if (!isConnected) {
    return <div className="text-center p-4">Please connect your wallet</div>;
  }

  if (!isAdmin) {
    return <div className="text-center p-4">Only admin can access this page</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="space-y-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Voting Management</h3>
          <Button
            onClick={handleEndVoting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            End Voting & Reset
          </Button>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Candidate Management</h3>
          <Button
            onClick={() => router.push('/register')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Register New Candidate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 