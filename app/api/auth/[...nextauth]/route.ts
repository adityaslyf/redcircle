import NextAuth from "next-auth";
import RedditProvider from "next-auth/providers/reddit";

const handler = NextAuth({
  providers: [
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      authorization: {
        params: { 
          duration: "permanent",
          scope: "read identity submit" // Add scopes for reading posts, user identity, and submitting
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Store the Reddit access token in the JWT token
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Make the access token available in the session
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.provider = token.provider as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 