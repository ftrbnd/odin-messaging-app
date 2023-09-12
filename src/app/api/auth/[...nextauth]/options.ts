import dbConnect from '@/utils/dbConnect';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},

      async authorize(credentials) {
        try {
          await dbConnect();

          const user = await User.findOne({ email: credentials?.email });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(credentials?.password, user.password);
          if (!passwordsMatch) return null;

          return user;
        } catch (err) {
          console.log('Error: ', err);
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/account'
  }
};
