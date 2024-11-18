"use client"

import React from 'react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-12">About ChainVote</h1>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">What is this dApp?</h2>
          <p className="text-gray-300 leading-relaxed">
            ChainVote is built on the Ethereum blockchain, 
            ensuring transparent, secure, and tamper-proof elections. It leverages smart contracts 
            to maintain the integrity of the voting process while providing a user-friendly interface 
            for both administrators and voters.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🔒 Secure Voting</h3>
              <p className="text-gray-300">
                Each wallet can only vote once per election, and all votes are permanently 
                recorded on the blockchain.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">👥 Transparent Process</h3>
              <p className="text-gray-300">
                All voting data is public and verifiable on the blockchain, ensuring 
                complete transparency.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🎯 Multiple Elections</h3>
              <p className="text-gray-300">
                Support for multiple election sessions with unique titles and candidate pools.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📸 IPFS Integration</h3>
              <p className="text-gray-300">
                Candidate photos are stored on IPFS, ensuring decentralized and permanent storage.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">For Administrators</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Connect wallet with admin privileges</li>
                <li>Start a new election by setting a title</li>
                <li>Register candidates with their details and photos</li>
                <li>Monitor voting progress</li>
                <li>End election and declare results</li>
              </ol>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">For Voters</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Connect MetaMask wallet</li>
                <li>View active election and candidates</li>
                <li>Cast one vote per election</li>
                <li>View real-time results</li>
                <li>Verify vote on the blockchain</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Technical Stack</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <ul className="text-gray-300 space-y-2">
              <li>• <strong>Frontend:</strong> Next.js, TypeScript, TailwindCSS</li>
              <li>• <strong>Blockchain:</strong> Ethereum, Solidity Smart Contracts</li>
              <li>• <strong>Storage:</strong> IPFS via Pinata</li>
              <li>• <strong>Web3:</strong> ethers.js, MetaMask</li>
              <li>• <strong>UI Components:</strong> Shadcn/ui</li>
            </ul>
          </div>
        </section>

        {/* Security Measures */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Security Measures</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <ul className="text-gray-300 space-y-2">
              <li>• Admin-only access for election management</li>
              <li>• One vote per wallet per election</li>
              <li>• Immutable voting records on blockchain</li>
              <li>• Decentralized image storage</li>
              <li>• Smart contract security best practices</li>
            </ul>
          </div>
        </section>

        {/* Contact/Footer */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-300 mb-6">
            Connect your MetaMask wallet to participate in active elections or 
            contact the administrator for more information.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://github.com/Xkirit/VoteChain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              GitHub Repository
            </a>
            <a 
              href="mailto:your@email.com" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Contact Admin
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
