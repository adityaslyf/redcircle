'use client';
import Link from 'next/link';


import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu, X } from 'lucide-react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { signIn, signOut, useSession } from "next-auth/react";

export function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loading, error } = useWalletConnection();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 font-silkscreen">
              redcircle
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#how-it-works" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-nunito"
            >
              How it Works
            </a>
            <a 
              href="#features" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-nunito"
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-nunito"
            >
              Community
            </a>
            <Link href="/reddit-form" className="text-gray-600 hover:text-gray-900 transition-colors font-nunito">RedditForm</Link>
            <Link href="/reddit-post" className="text-gray-600 hover:text-gray-900 transition-colors font-nunito">Reddit Post</Link>
          </nav>

          {/* Desktop Wallet Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Reddit Auth Buttons */}
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-nunito mr-2">
                  {session?.user?.name || session?.user?.email || "Reddit User"}
                </span>
                <button onClick={() => signOut()} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
              </>
            ) : (
              <button onClick={() => signIn("reddit")}
                className="px-3 py-1 bg-orange-500 text-white rounded"
              >
                Login with Reddit
              </button>
            )}
            
            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}
            <WalletMultiButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a 
                href="#how-it-works" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </a>
              <a 
                href="#features" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </a>
              <Link href="/reddit-form" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito">
                RedditForm
              </Link>
              <Link href="/reddit-post" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito">
                Reddit Posts
              </Link>
              <div className="px-3 py-2 space-y-2">
                {loading && (
                  <div className="text-sm text-blue-600">
                    Saving wallet...
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-600">
                    {error}
                  </div>
                )}
                <WalletMultiButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}