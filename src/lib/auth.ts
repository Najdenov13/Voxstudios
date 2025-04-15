import NextAuth, { NextAuthOptions, getServerSession as getNextAuthServerSession } from 'next-auth';
import { Account, DefaultSession } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: 'openid profile email Files.ReadWrite.All',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export const getServerSession = () => getNextAuthServerSession(authOptions); 