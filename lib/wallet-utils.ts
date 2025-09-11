import { supabase } from './Supabase-client';

export interface User {
  id?: string;
  wallet_address: string;
  points?: number;
  created_at?: string;
}

/**
 * Insert or update user wallet address in Supabase
 * @param walletAddress - The connected wallet's public key as string
 * @returns Promise with the result
 */

export async function saveWalletAddress(walletAddress: string) {
  try {
    // First checUserk if wallet address already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('Users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error checking existing user:', fetchError);
      throw fetchError;
    }

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return { data: existingUser, error: null };
    }

    // Insert new user with wallet address
    const { data, error } = await supabase
      .from('Users')
      .insert([
        {
          wallet_address: walletAddress,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting wallet address:', error);
      throw error;
    }

    console.log('Successfully saved wallet address:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error in saveWalletAddress:', error);
    return { data: null, error };
  }
}

/**
 * Get user data by wallet address
 * @param walletAddress - The wallet address to search for
 * @returns Promise with user data
 */
export async function getUserByWallet(walletAddress: string) {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserByWallet:', error);
    return { data: null, error };
  }
}
