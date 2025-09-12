import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { getServerSession } from "next-auth/next"
import NextAuth from "next-auth";
import RedditProvider from "next-auth/providers/reddit";

// Import the NextAuth handler to get the configuration
const authOptions = {
  providers: [
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      authorization: {
        params: { 
          duration: "permanent",
          scope: "read identity submit"
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.provider = token.provider as string;
      return session;
    },
  },
};

interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  url: string;
  selftext: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  thumbnail: string;
  is_video: boolean;
  media?: any;
}

class RedditAPI {
  private userAccessToken: string;

  constructor(userAccessToken: string) {
    this.userAccessToken = userAccessToken;
  }

  private extractPostIdFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      // Reddit URL format: /r/subreddit/comments/post_id/title/
      const commentsIndex = pathParts.indexOf('comments');
      if (commentsIndex !== -1 && pathParts[commentsIndex + 1]) {
        return pathParts[commentsIndex + 1];
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing Reddit URL:', error);
      return null;
    }
  }

  async fetchPostByUrl(url: string): Promise<RedditPost | null> {
    try {
      const postId = this.extractPostIdFromUrl(url);
      if (!postId) {
        throw new Error('Invalid Reddit URL format');
      }

      if (!this.userAccessToken) {
        throw new Error('User not authenticated with Reddit');
      }
      
      const response = await axios.get(`https://oauth.reddit.com/comments/${postId}.json`, {
        headers: {
          'Authorization': `Bearer ${this.userAccessToken}`,
          'User-Agent': 'RedCircle/1.0.0'
        }
      });

      const data = response.data;
      
      // The first element contains the post data
      if (data && data[0] && data[0].data && data[0].data.children && data[0].data.children[0]) {
        return data[0].data.children[0].data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching Reddit post:', error);
      throw error;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.accessToken) {
      return NextResponse.json({ error: 'No Reddit access token found. Please re-authenticate with Reddit.' }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Create Reddit API instance with user's access token
    const redditAPI = new RedditAPI(session.accessToken);
    const post = await redditAPI.fetchPostByUrl(url);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error in Reddit API route:', error);
    
    // Handle specific authentication errors
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Reddit authentication expired. Please log in again.' }, 
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch Reddit post' }, 
      { status: 500 }
    );
  }
} 