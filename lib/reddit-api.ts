import axios from 'axios';

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
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
  };
  post_hint?: string;
  domain?: string;
}

interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

class RedditAPI {
  constructor() {
    // Client-side API now uses server-side route with user authentication
  }

  async fetchPostByUrl(url: string): Promise<RedditPost | null> {
    try {
      const response = await axios.post('/api/reddit', { url });

      return response.data.post;
    } catch (error: unknown) {
      console.error('Error fetching Reddit post:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.error;
        
        // Handle specific authentication errors
        if (status === 401) {
          if (errorMessage?.includes('Not authenticated')) {
            throw new Error('Please log in with Reddit to fetch posts');
          } else if (errorMessage?.includes('access token')) {
            throw new Error('Reddit authentication expired. Please log in again');
          } else {
            throw new Error('Authentication required. Please log in with Reddit');
          }
        }
        
        // Handle other errors
        throw new Error(errorMessage || 'Failed to fetch post');
      }
      
      throw new Error('An unexpected error occurred while fetching the post');
    }
  }

  async fetchMultiplePosts(urls: string[]): Promise<(RedditPost | null)[]> {
    const promises = urls.map(url => 
      this.fetchPostByUrl(url).catch(error => {
        console.error(`Failed to fetch post for URL ${url}:`, error);
        return null; // Return null for failed requests
      })
    );
    return Promise.all(promises);
  }
}

export const redditAPI = new RedditAPI();
export type { RedditPost }; 