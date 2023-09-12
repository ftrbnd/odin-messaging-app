import dbConnect from '@/utils/dbConnect';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Email'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password'
        }
      },

      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        try {
          await dbConnect();

          const user = await User.findOne({ email: email });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          return user;
        } catch (err) {
          console.log('Error: ', err);
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/account'
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        let resOk = true;

        const { name, email } = user;
        console.log('google: ', name, email);

        try {
          await dbConnect();
          const userExists = await User.findOne<IUser>({ email });

          if (!userExists) {
            const res = await fetch(`http://localhost:3000/api/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email,
                username: name,
                avatar: user.image,
                authMethod: 'google'
              })
            });

            console.log('user exists: ', userExists);

            resOk = res.ok;
          }
        } catch (error) {
          console.log(error);
          resOk = false;
        }

        return resOk;
      } else {
        return true;
      }
    },
    async session({ session }) {
      await dbConnect();

      const dbUser = await User.findOne<IUser>({ email: session.user.email });

      if (dbUser) {
        session.user = {
          ...session.user,
          name: dbUser.username,
          image: dbUser.avatar,
          id: dbUser._id.toString()
        };
      }

      return session;
    }
  }
};
