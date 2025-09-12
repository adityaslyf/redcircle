'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { supabase } from '../../lib/Supabase-client';
import { redditAPI } from '../../lib/reddit-api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  LogIn,
  LogOut,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Clock,
  Users,
  ArrowUp,
  Circle,
  Globe,
  Shield
} from 'lucide-react';

interface PostWithRedditData {
  id: number;
  reddit_url: string;
  created_at: string;
  user_id?: string;
  reddit_post?: any;
  loading?: boolean;
  error?: string;
}

const RedditLoginPage = () => {
  const { data: session, status } = useSession();
  const [publicPosts, setPublicPosts] = useState<PostWithRedditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Fetch public posts from the platform
  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all posts from Supabase (public posts)
        const { data: posts, error: supabaseError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20); // Limit to latest 20 posts

        if (supabaseError) {
          throw supabaseError;
        }

        if (posts && posts.length > 0) {
          // Fetch Reddit data for each post
          const postsWithData = await Promise.all(
            posts.map(async (post) => {
              try {
                const redditData = await redditAPI.fetchPostByUrl(post.reddit_url);
                return {
                  ...post,
                  reddit_post: redditData,
                  loading: false,
                  error: null
                };
              } catch (err) {
                return {
                  ...post,
                  reddit_post: null,
                  loading: false,
                  error: 'Failed to load Reddit data'
                };
              }
            })
          );

          setPublicPosts(postsWithData);
        } else {
          setPublicPosts([]);
        }
      } catch (err) {
        console.error('Error fetching public posts:', err);
        setError('Failed to load public posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`;
    }
    return score.toString();
  };

  const handleRedditLogin = () => {
    signIn('reddit');
  };

  const handleRedditLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
                         <div className="flex items-center gap-3">
               <Circle className="w-8 h-8 text-orange-500 fill-orange-500" />
               <h1 className="text-xl font-bold text-gray-900">Reddit Integration</h1>
             </div>
            
            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {session?.user?.name || 'Reddit User'}
                    </span>
                  </div>
                  <Button 
                    onClick={handleRedditLogout}
                    variant="outline"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleRedditLogin}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with Reddit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to RedCircle
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover and share amazing Reddit posts from our community. 
              {!isAuthenticated && ' Login with Reddit to submit your own posts and earn points!'}
            </p>
            
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="max-w-md mx-auto bg-orange-50 border-orange-200">
                                     <CardContent className="p-6 text-center">
                     <Circle className="w-12 h-12 text-orange-500 fill-orange-500 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Join Our Community
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Connect your Reddit account to submit posts, earn points, and unlock exclusive features.
                    </p>
                    <Button 
                      onClick={handleRedditLogin}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login with Reddit
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Public Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-500" />
              Public Posts
            </h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {publicPosts.length} posts
            </Badge>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : publicPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h4>
                <p className="text-gray-600 mb-4">
                  Be the first to share an amazing Reddit post with our community!
                </p>
                                 {isAuthenticated && (
                   <Button onClick={() => window.location.href = '/reddit-form'}>
                     <ExternalLink className="w-4 h-4 mr-2" />
                     Submit First Post
                   </Button>
                 )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      {post.reddit_post ? (
                        <div>
                          <CardTitle className="text-lg mb-2 line-clamp-2">
                            {post.reddit_post.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Badge variant="outline" className="text-xs">
                              r/{post.reddit_post.subreddit}
                            </Badge>
                            <span>by u/{post.reddit_post.author}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <CardTitle className="text-lg mb-2">
                            Reddit Post
                          </CardTitle>
                          <p className="text-sm text-gray-600">Loading...</p>
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {post.reddit_post && (
                        <div className="space-y-3">
                          {post.reddit_post.selftext && (
                            <p className="text-gray-700 text-sm line-clamp-3">
                              {post.reddit_post.selftext}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <ArrowUp className="w-4 h-4" />
                                <span>{formatScore(post.reddit_post.score)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.reddit_post.num_comments}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => window.open(post.reddit_url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Reddit
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {post.error && (
                        <div className="text-center py-4">
                          <p className="text-red-600 text-sm mb-2">{post.error}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(post.reddit_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Original
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Share?
                </h4>
                <p className="text-gray-600 mb-6">
                  Submit your own Reddit posts and earn points in our community!
                </p>
                                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button 
                     className="bg-purple-600 hover:bg-purple-700"
                     onClick={() => window.location.href = '/reddit-form'}
                   >
                     <ExternalLink className="w-4 h-4 mr-2" />
                     Submit New Post
                   </Button>
                   <Button 
                     variant="outline"
                     onClick={() => window.location.href = '/profile'}
                   >
                     <TrendingUp className="w-4 h-4 mr-2" />
                     View My Profile
                   </Button>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RedditLoginPage; 