"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {FaHome, FaBars, FaSearch, FaPlus, FaUser, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-blue-900 text-white">
        {/* Left: Hamburger Menu */}
        <button onClick={() => setMenuOpen(true)} className="text-white text-2xl cursor-pointer p-2">
          <FaBars />
        </button>

        {/* Center: Logo */}
        <Link href="/" className="text-3xl font-serif first-letter:text-red-600 font-bold">
            Reference.
        </Link>

        {/* Right: Profile or Login Button */}
        {session ? (
          <Link href="/dashboard">
            <Image 
                src={session.user?.image || "/default-avatar.png"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-white" 
                width={50} 
                height={50} 
                unoptimized 
                />

          </Link>
        ) : (
          <button onClick={() => signIn("google")} className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold">
            Log in
          </button>
        )}
      </nav>

      {/* Sidebar (Only when menuOpen is true) */}
      {menuOpen && (
        <div className="fixed inset-0   bg-opacity-50 z-50" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-64 bg-white text-black shadow-lg p-4 transition-transform transform translate-x-0"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
          >
            {/* Close Button */}
            <button onClick={() => setMenuOpen(false)} className="text-gray-600 text-lg absolute right-4 top-4">
              ✖
            </button>

            {/* Sidebar Links */}
            <div className="mt-8 space-y-6">
              <Link href="/search" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <FaSearch /> Search
              </Link>
              <Link href="/create" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <FaPlus /> Create Post
              </Link>
              <Link href="/about" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <FaInfoCircle /> About
              </Link>

              {session ? (
                <>
                  <Link href="/dashboard" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <FaUser /> Profile
                  </Link>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <button onClick={() => signIn("google")} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                  <FaUser /> Log in
                </button>
              )}
            </div>
          </div>
        </div>

        
      )}

      {/* Mobile Bottom Navigation */}
      {session ? (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-blue-900 text-white flex justify-around items-center py-3">
            <Link href="/" className="flex flex-col items-center gap-1">
            <FaHome className="w-8 h-8" /> {/* Same size as profile image */}
            <span className="text-sm">Home</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center gap-1">
            <FaSearch className="w-8 h-8" /> {/* Increased size */}
            <span className="text-sm">Search</span>
            </Link>
            <Link href="/create" className="flex flex-col items-center gap-1">
            <FaPlus className="w-8 h-8" /> {/* Increased size */}
            <span className="text-sm">Create</span>
            </Link>
            <Link href={session ? "/dashboard" : "/login"} className="flex flex-col items-center gap-1">
            <Image 
                src={session.user?.image || "/default-avatar.png"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white" 
                width={32} 
                height={32} 
                unoptimized 
            />
            <span className="text-sm">Profile</span>
            </Link>
        </div>
        ) : (
        <div></div>
        )}

    </>
  );
}
