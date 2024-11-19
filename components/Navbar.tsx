"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Poppins } from 'next/font/google';
import { ethers } from 'ethers';

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
});

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };

    connectWallet();
  }, []);

  const handleLinkClick = () => {
    // Close mobile menu
    setIsMenuOpen(false);
    // Close desktop details menu
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <div className={`navbar sticky top-0 z-50 bg-background border-b ${poppins.className}`}>
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {isMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-card rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/" className="text-foreground" onClick={handleLinkClick}>Vote</Link>
              </li>
              <li>
                <a className="text-foreground">Admin</a>
                <ul className="p-2 bg-card">
                  <li>
                    <Link href="/admin" className="text-foreground" onClick={handleLinkClick}>
                      Election Control
                    </Link>
                  </li>
                  <li>
                    <Link href="/Register" className="text-foreground" onClick={handleLinkClick}>
                      Register Candidate
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/about" className="text-foreground" onClick={handleLinkClick}>About</Link>
              </li>
            </ul>
          )}
        </div>
        <a className="btn btn-ghost text-xl text-foreground font-poppins" href="/">ChainVote</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className="text-foreground">Vote</Link>
          </li>
          <li>
            <details ref={detailsRef}>
              <summary className="text-foreground">Admin</summary>
              <ul className="p-2 bg-card">
                <li>
                  <Link href="/admin" className="text-foreground" onClick={handleLinkClick}>
                    Election Control
                  </Link>
                </li>
                <li>
                  <Link href="/Register" className="text-foreground" onClick={handleLinkClick}>
                    Register Candidate
                  </Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href="/about" className="text-foreground">About</Link>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {userAddress ? (
          <>
            {/* Desktop view */}
            <div className="hidden md:flex items-center gap-2 px-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
            </div>
            {/* Mobile view */}
            <div className="md:hidden flex items-center gap-2 px-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                {userAddress.slice(0, 4)}...{userAddress.slice(-4)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 px-4">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs md:text-sm text-muted-foreground">
              Not Connected
            </span>
          </div>
        )}
        <div className="lg:hidden ml-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
