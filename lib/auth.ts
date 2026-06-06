import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: "saftiee2024secret",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",        type: "email"    },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email !== "admin@saftiee.dz") return null;
        const valid = await bcrypt.compare(
          credentials.password,
          "$2b$10$Kw20enuJj8lA9fiOAuU85uvpd27G8pG8Qyie8auyw8CJ8R7CkBNDW"
        );
        if (!valid) return null;
        return { id: "admin", email: "admin@saftiee.dz", name: "Administrateur" };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: {
    signIn: "/admin/login",
    error:  "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (token) (session as any).role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);
