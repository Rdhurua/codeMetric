
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/db";
import User from "@/app/model/User"; 
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        await connectDB();

        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials;

        const user = await User.findOne({ email });

        if (user && (await compare(password, user.password))) {
          return user;
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
