'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu, X } from 'lucide-react';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import ClientOnly from '../ui/client-only';

export function HeaderSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loading, error } = useWalletConnection(true); // Enable redirect for header wallet connection

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-bold text-gray-900 font-silkscreen">
              redcircle
            </Link>
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
            <Link href="/reddit-login" className="text-gray-600 hover:text-gray-900 transition-colors font-nunito">
              Reddit Hub
            </Link>
            <Link href="/reddit-form" className="text-gray-600 hover:text-gray-900 transition-colors font-nunito">
              Submit Post
            </Link>
            <Link href="/reddit-post" className="text-gray-600 hover:text-gray-900 transition-colors font-nunito">
              All Posts
            </Link>
          </nav>

          {/* Desktop Wallet Section */}
          <div className="hidden md:flex items-center space-x-4">
            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}
            <ClientOnly fallback={<div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />}>
              <WalletMultiButton />
            </ClientOnly>
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
              <Link href="/reddit-login" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito">
                Reddit Hub
              </Link>
              <Link href="/reddit-form" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito">
                Submit Post
              </Link>
              <Link href="/reddit-post" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors font-nunito">
                All Posts
              </Link>
              <div className="px-3 py-2 space-y-2">
                {loading && (
                  <div className="text-sm text-blue-600">
                    Connecting wallet...
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-600">
                    {error}
                  </div>
                )}
                <ClientOnly fallback={<div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />}>
                  <WalletMultiButton />
                </ClientOnly>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
