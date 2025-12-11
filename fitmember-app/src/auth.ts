import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 여기서 실제 DB 검증 로직 구현
        // 현재는 간단한 예시
        if (credentials?.email === "minsu@example.com" && credentials?.password === "password123") {
          return {
            id: "user-1",
            name: "김민수",
            email: "minsu@example.com",
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google") {
        token.provider = "google";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account }) {
      // 신규 사용자인 경우 회원가입 페이지로 리다이렉트할 수 있음
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
});
