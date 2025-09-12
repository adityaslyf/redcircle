import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { saveWalletAddress, User } from '../lib/wallet-utils';
import { useRouter, usePathname } from 'next/navigation';

export function useWalletConnection(redirectToDashboard: boolean = false) {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function handleWalletConnection() {
      if (connected && publicKey) {
        setLoading(true);
        setError(null);
        
        try {
          const walletAddress = publicKey.toString();
          
          // Save wallet address to Supabase
          const { data, error } = await saveWalletAddress(walletAddress);
          
          if (error) {
            setError('Failed to save wallet address');
            console.error('Error saving wallet:', error);
          } else {
            setUser(data);
            console.log('Wallet connected and saved:', walletAddress);
            
            // Only redirect to dashboard if explicitly requested AND not already on protected pages
            if (redirectToDashboard && !pathname.startsWith('/dashboard') && !pathname.startsWith('/profile') && !pathname.startsWith('/reddit-')) {
              setTimeout(() => {
                router.push('/dashboard');
              }, 1000);
            }
          }
        } catch (err) {
          setError('An unexpected error occurred');
          console.error('Unexpected error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Reset user data when wallet disconnects
        setUser(null);
        setError(null);
      }
    }

    handleWalletConnection();
  }, [connected, publicKey, router, redirectToDashboard, pathname]);

  return {
    user,
    loading,
    error,
    walletAddress: publicKey?.toString() || null,
    connected
  };
}
