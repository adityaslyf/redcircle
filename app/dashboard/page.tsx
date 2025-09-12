'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Boxes } from '@/components/ui/background-boxes';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { TextGenerator } from '@/components/ui/text-generator';
import ClientOnly from '@/components/ui/client-only';
import { Wallet, ArrowRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const { user, loading, error } = useWalletConnection(false); // Don't auto-redirect, handle it manually

  // Redirect to home if wallet is not connected
  React.useEffect(() => {
    if (!connected && !loading) {
      window.location.href = '/';
    }
  }, [connected, loading]);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-30"
        >
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-silkscreen text-2xl mb-2">Connect Your Wallet</CardTitle>
                <CardDescription className="text-gray-600">
                  Please connect your Solana wallet to access the dashboard
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <ClientOnly fallback={<div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />}>
                  <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !rounded-lg !font-medium" />
                </ClientOnly>
                <Link href="/" className="block text-gray-600 hover:text-gray-900 transition-colors">
                  ← Back to Home
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Create a profile preview image URL (placeholder for now)
  const profilePreviewSrc = "data:image/svg+xml;base64," + btoa(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:0.9" />
        </linearGradient>
        <linearGradient id="purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="600" fill="url(#bg)"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="800" height="60" fill="rgba(255,255,255,0.8)"/>
      <text x="40" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1f2937">redcircle | Profile</text>
      
      <!-- Profile Card -->
      <rect x="50" y="100" width="700" height="140" rx="12" fill="url(#card)"/>
      
      <!-- Avatar -->
      <circle cx="130" cy="170" r="35" fill="url(#purple)"/>
      <rect x="115" y="155" width="30" height="30" fill="white" rx="4"/>
      <circle cx="120" cy="165" r="3" fill="url(#purple)"/>
      <path d="M 115 175 Q 130 185 145 175" stroke="url(#purple)" stroke-width="2" fill="none"/>
      
      <!-- Profile Text -->
      <text x="200" y="150" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#1f2937">User Profile</text>
      <text x="200" y="180" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Connected Wallet</text>
      <text x="200" y="200" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Member since 2025</text>
      
      <!-- Wallet Info Card -->
      <rect x="50" y="270" width="340" height="200" rx="12" fill="url(#card)"/>
      <text x="70" y="300" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1f2937">Wallet Information</text>
      <text x="70" y="320" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Your Solana wallet details</text>
      
      <text x="70" y="350" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Public Key</text>
      <rect x="70" y="355" width="300" height="25" rx="4" fill="#f9fafb" stroke="#e5e7eb"/>
      <text x="75" y="370" font-family="monospace" font-size="10" fill="#6b7280">${publicKey?.toString().slice(0, 20)}...</text>
      
      <text x="70" y="400" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Connection Status</text>
      <circle cx="80" cy="415" r="4" fill="#10b981"/>
      <text x="95" y="420" font-family="Arial, sans-serif" font-size="12" fill="#059669">Connected</text>
      
      <text x="70" y="450" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151">Total Points</text>
      <text x="70" y="470" font-family="monospace" font-size="20" font-weight="bold" fill="#9333ea">${user?.points || 0}</text>
      
      <!-- Reddit Card -->
      <rect x="410" y="270" width="340" height="200" rx="12" fill="url(#card)"/>
      <text x="430" y="300" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1f2937">Reddit Integration</text>
      <text x="430" y="320" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Account connection status</text>
      
      <circle cx="440" cy="345" r="4" fill="#ef4444"/>
      <text x="455" y="350" font-family="Arial, sans-serif" font-size="12" fill="#dc2626">Not Connected</text>
      
      <text x="430" y="380" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">Connect your Reddit account to unlock</text>
      <text x="430" y="395" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">advanced features and earn rewards.</text>
      
      <!-- Action Button -->
      <rect x="430" y="420" width="280" height="35" rx="6" fill="url(#purple)"/>
      <text x="540" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">Connect Reddit Account</text>
    </svg>
  `);

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Boxes */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      
      {/* Header */}
      <header className="relative z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="text-xl font-bold text-gray-900 font-silkscreen hover:text-purple-600 transition-colors">
                redcircle
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900 font-nunito">Dashboard</h1>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/profile" className="text-gray-600 hover:text-purple-600 font-nunito transition-colors">
                Profile
              </Link>
              <ClientOnly fallback={<div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />}>
                <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 !rounded-lg !font-medium" />
              </ClientOnly>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div 
          className="pt-20 pb-10 text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <div className="mb-8">
              <TextGenerator
                words="Welcome to redcircle"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-silkscreen text-white leading-tight"
                filter={true}
                duration={0.8}
              />
            </div>
            <motion.p 
              className="text-gray-300 font-nunito text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
            </motion.p>
          </motion.div>
        </motion.div>

        {/* MacBook Scroll Section */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <div className="cursor-pointer" onClick={handleProfileClick}>
            <MacbookScroll
              src={profilePreviewSrc}
              showGradient={false}
              badge={
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-nunito">
                  Click to explore
                </div>
              }
            />
          </div>
        </motion.div>

        {/* Status Messages */}
        {loading && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center space-x-3 p-4 bg-blue-50/90 backdrop-blur-sm border border-blue-200 rounded-xl">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-700 font-nunito">Loading your data...</p>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl">
              <p className="text-red-700 font-nunito">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
