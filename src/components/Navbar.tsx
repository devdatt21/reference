"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {FaBars, FaSearch, FaPlus, FaUser, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
                src={session.user?.image || ""} 
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
        <div className="fixed inset-0 bg-opacity-50 z-50" onClick={() => setMenuOpen(false)}>
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
              <Link href="/" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <FaSearch /> Search
              </Link>
              <Link href="/createpost" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <FaPlus /> Create Post
              </Link>
              <Link href="/" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <FaInfoCircle /> About
              </Link>

              {session ? (
                <>
                  <Link href="/" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
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
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
      <nav
        className="flex items-center justify-between px-8 py-4 text-white shadow-lg 
                   bg-gradient-to-b from-blue-900/80 via-blue-800/40 to-transparent 
                   backdrop-blur-md"
      >
        <Link href="/" className="text-2xl font-serif first-letter:text-red-600 font-bold">
          Reference.
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2">
            <FaSearch className="w-6 h-6" />
          </Link>

          {session ? (
            <>
              <Link href="/createpost" className="p-2">
                <FaPlus className="w-6 h-6" />
              </Link>

              {/* Profile Picture with Clickable Dropdown */}
              <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className="p-1">
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-white"
                    width={32}
                    height={32}
                    unoptimized
                  />
                </button>

                {/* Sign Out Modal */}
                {isOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-lg py-2"
                    onClick={() => setIsOpen(false)} // Close when clicking inside
                  >
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-white text-blue-900 px-3 py-1 rounded-lg text-sm font-semibold"
            >
              Log in
            </button>
          )}
        </div>
      </nav>
    </div>

      
          
        

    </>
  );
}
