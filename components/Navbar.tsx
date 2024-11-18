"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar sticky top-0 bg-gray-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Vote</Link>
             
            </li>
            <li>
              <a>Admin</a>
              <ul className="p-2 bg-white">
                <li className="bg-white">
                  <Link href="/admin">Election Control</Link>
                </li>
                <li>
                  <Link href="/Register">Register Candidate</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">ChainVote</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Vote</Link>
          </li>
          <li>
            <details>
              <summary>Admin</summary>
              <ul className="p-2 bg-white">
                <li>
                  <Link href="/admin">Election Control</Link>
                </li>
                <li>
                  <Link href="/Register">Register Candidate</Link>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        
      </div>
    </div>
  );
};

export default Navbar;
