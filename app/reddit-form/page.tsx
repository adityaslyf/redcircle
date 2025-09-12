"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/Supabase-client'
import { signIn, signOut, useSession } from "next-auth/react";

export default function RedditFormPage() {
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { data: session, status } = useSession();
  const isRedditAuthenticated = status === "authenticated";

  const validateRedditUrl = (url: string): boolean => {
    if (!url.trim()) return false
    
    // Basic Reddit URL validation
    const redditUrlPattern = /^https?:\/\/(www\.)?reddit\.com\/r\/[\w-]+\/comments\/[\w-]+/
    return redditUrlPattern.test(url.trim())
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    setSubmitStatus('idle')
    setErrorMessage('')
    
    // Only validate if user has typed something
    if (newUrl.trim()) {
      setIsValid(validateRedditUrl(newUrl))
    } else {
      setIsValid(true) // Reset validation state when empty
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateRedditUrl(url)) {
      setIsValid(false)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    
    try {
      // Check if Supabase client is properly configured
      if (!supabase) {
        throw new Error('Supabase client not configured')
      }

      console.log('Attempting to insert URL:', url.trim())
      
      // Check if this specific URL already exists (by anyone)
      const { data: existingUrlData, error: urlCheckError } = await supabase
        .from('posts')
        .select('id')
        .eq('reddit_url', url.trim())
        .single()

      if (urlCheckError && urlCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing URL:', urlCheckError)
        setSubmitStatus('error')
        setErrorMessage('Error checking URL availability')
        return
      }

      if (existingUrlData) {
        setSubmitStatus('error')
        setErrorMessage('This Reddit URL has already been submitted')
        return
      }

      // Insert the new record with only the URL
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { 
            reddit_url: url.trim()
          }
        ])

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setSubmitStatus('error')
        setErrorMessage(error.message || 'Failed to save URL')
      } else {
        console.log('Data inserted successfully:', data)
        setSubmitStatus('success')
        setUrl('') // Reset form
        setIsValid(true)
      }

    } catch (error) {
      console.error('Unexpected error:', error)
      setSubmitStatus('error')
      setErrorMessage('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6 md:px-8">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
              <svg  
                className="w-6 h-6 sm:w-8 sm:h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Reddit Post URL
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base md:text-lg mt-2">
              Enter a Reddit post URL to get started
            </CardDescription>
            <div className="flex flex-col items-center gap-2 mt-2">
              {isRedditAuthenticated ? (
                <>
                  <span className="text-green-700 font-semibold">Logged in as {session?.user?.name || session?.user?.email || "Reddit User"}</span>
                  <button onClick={() => signOut()} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
                </>
              ) : (
                <button onClick={() => signIn("reddit")}
                  className="px-3 py-1 bg-orange-500 text-white rounded"
                >
                  Login with Reddit
                </button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <label 
                  htmlFor="reddit-url" 
                  className="block text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide"
                >
                  Reddit Post URL
                </label>
                <div className="relative">
                  <input
                    id="reddit-url"
                    type="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://reddit.com/r/subreddit/comments/..."
                    className={cn(
                      "w-full px-4 sm:px-6 py-3 sm:py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-sm sm:text-base md:text-lg text-black",
                      "placeholder-gray-400 bg-white/50 backdrop-blur-sm",
                      isValid 
                        ? "border-gray-200 focus:border-orange-500 focus:ring-orange-100 hover:border-gray-300" 
                        : "border-red-300 focus:border-red-500 focus:ring-red-100"
                    )}
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                {!isValid && url.trim() && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1 sm:gap-2 animate-pulse">
                    <svg 
                      className="w-3 h-3 sm:w-4 sm:h-4" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    Please enter a valid Reddit post URL
                  </p>
                )}
                
                {submitStatus === 'success' && (
                  <p className="text-xs sm:text-sm text-green-600 flex items-center gap-1 sm:gap-2 animate-pulse">
                    <svg 
                      className="w-3 h-3 sm:w-4 sm:h-4" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    URL saved successfully!
                  </p>
                )}
                
                {submitStatus === 'error' && (
                  <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1 sm:gap-2 animate-pulse">
                    <svg 
                      className="w-3 h-3 sm:w-4 sm:h-4" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    {errorMessage || 'Failed to save URL'}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={!url.trim() || !isValid || isSubmitting || !isRedditAuthenticated}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 sm:py-4 rounded-xl text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:transform-none disabled:shadow-none"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg 
                      className="animate-spin h-5 w-5 sm:h-6 sm:w-6" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base">Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <svg 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-sm sm:text-base md:text-lg">Submit URL</span>
                  </div>
                )}
              </Button>
              {!isRedditAuthenticated && (
                <div className="text-xs text-red-600 mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="font-semibold">Reddit Authentication Required</p>
                  <p className="mt-1">You must be logged in with Reddit to submit URLs and access post data. Click "Login with Reddit" above to authenticate.</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
