'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { getUserByWallet } from '../../lib/wallet-utils';
import { supabase } from '../../lib/Supabase-client';
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink 
} from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientOnly from '@/components/ui/client-only';
import {
  User,
  Wallet,
  Activity,
  Settings,
  Home,
  FileText,
  ExternalLink,
  Calendar,
  TrendingUp,
  Shield,
  Coins,
  Link as LinkIcon,
  MessageCircle
} from 'lucide-react';

interface UserProfile {
  id: string;
  wallet_address: string;
  points: number;
  created_at: string;
}

interface RedditPost {
  id: number;
  reddit_url: string;
  created_at: string;
}

const ProfilePage = () => {
  const { publicKey, connected } = useWallet();
  const { user, loading: walletLoading, error } = useWalletConnection(false); // No redirect from profile page
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar navigation links
  const links = [
    {
      label: "Reddit Posts",
      href: "/reddit-post",
      icon: <MessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Your Profile",
      href: "/profile",
      icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Upload Posts",
      href: "/reddit-form",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Login With Reddit",
      href: "/reddit-login",
      icon: <ExternalLink className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      try {
        const walletAddress = publicKey.toString();
        
        // Get user data from wallet utils
        const { data: userData, error: userError } = await getUserByWallet(walletAddress);
        
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData) {
          setUserProfile(userData);
        }

        // Fetch user's Reddit posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', userData?.id)
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Error fetching user posts:', postsError);
        } else {
          setUserPosts(postsData || []);
        }
      } catch (err) {
        console.error('Error in fetchUserData:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [connected, publicKey, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your Solana wallet to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <Wallet className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            </div>
            <ClientOnly>
              <WalletMultiButton />
            </ClientOnly>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading || walletLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className="py-4 px-2">
              <motion.div
                className="font-bold text-lg text-neutral-800 dark:text-neutral-200"
                whileHover={{ scale: 1.05 }}
              >
                redcircle
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2 px-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* User Profile in Sidebar */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {publicKey ? formatWalletAddress(publicKey.toString()) : 'Unknown'}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {userProfile?.points || 0} points
                </p>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 h-full">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Content container with proper spacing */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto h-full">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                <p className="text-gray-600 text-sm md:text-base">Manage your account and view your activity</p>
              </div>

              {/* Profile Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Wallet Info Card */}
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wallet className="w-5 h-5 text-purple-500" />
                      Wallet Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Public Key</label>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-3 py-2 rounded-md text-xs md:text-sm font-mono flex-1 overflow-hidden">
                          {publicKey ? publicKey.toString() : 'Not connected'}
                        </code>
                        <Button variant="outline" size="sm" className="flex-shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Connected</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Member Since</label>
                        <p className="text-sm text-gray-600 mt-1">
                          {userProfile?.created_at ? formatDate(userProfile.created_at) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Points Card */}
                <Card className="col-span-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {userProfile?.points || 0}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Total earned points</p>
                    <Button size="sm" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Activity
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Reddit Activity */}
              <Card className="mb-6 md:mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    Reddit Activity
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Your submitted Reddit posts and activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-gray-900">{userPosts.length}</div>
                      <div className="text-xs md:text-sm text-gray-600">Posts Submitted</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-gray-900">
                        {userProfile?.points || 0}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Points Earned</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold text-gray-900">
                        {userProfile?.created_at ? 
                          Math.floor((Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24))
                          : 0
                        }
                      </div>
                      <div className="text-xs md:text-sm text-gray-600">Days Active</div>
                    </div>
                  </div>

                  {/* Recent Posts */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Posts</h4>
                    {userPosts.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {userPosts.slice(0, 5).map((post) => (
                          <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <LinkIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {post.reddit_url}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(post.created_at)}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="flex-shrink-0 ml-2">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4 text-sm md:text-base">No Reddit posts submitted yet</p>
                        <Button>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Submit Your First Post
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <Activity className="w-4 h-4 mr-2" />
                      Activity History
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <FileText className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-3">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;