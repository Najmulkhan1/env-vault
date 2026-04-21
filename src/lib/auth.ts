import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        is2FAVerified: { label: "2FA Verified", type: "text" }, // হিডেন ফ্ল্যাগ
      },
      async authorize(credentials) {
        await dbConnect();
        
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found with this email");

        // ১. যদি ২-ফ্যাক্টর ভেরিফাইড হয়ে আসে (২-ফ্যাক্টর পেজ থেকে), তবে সরাসরি ইউজার রিটার্ন করবে
        if (credentials?.is2FAVerified === "true") {
          return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name,
            twoFactorEnabled: user.twoFactorEnabled 
          };
        }

        // ২. সাধারণ লগইন এর ক্ষেত্রে পাসওয়ার্ড চেক
        const isValid = await bcrypt.compare(
          credentials?.password as string, 
          user.passwordHash
        );

        if (!isValid) throw new Error("Invalid password");

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name,
          twoFactorEnabled: user.twoFactorEnabled 
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, credentials }) {
      // ৩. ক্রেডেনশিয়াল লগইন এবং ২-ফ্যাক্টর চেক
      if (account?.provider === "credentials") {
        const dbUser = user as any;
        
        // যদি ২-ফ্যাক্টর এনাবল থাকে এবং এখনো ভেরিফাই না করা হয় (is2FAVerified ফ্ল্যাগ না থাকে)
        if (dbUser?.twoFactorEnabled && (credentials as any)?.is2FAVerified !== "true") {
          // ইউজারকে ওটিপি পেজে রিডাইরেক্ট করা
          return `/auth/2fa?email=${encodeURIComponent(dbUser.email)}`;
        }
      }
      // ২-ফ্যাক্টর অফ থাকলে বা অলরেডি ভেরিফাইড হলে সরাসরি লগইন
      return true; 
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" }
});