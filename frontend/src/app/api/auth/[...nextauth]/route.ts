import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak"
export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER
    })
  ], 
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token }) {
    // @ts-ignore
      session.accessToken = token.accessToken
      return session
    }
  },
  events: {
    signOut: ({ session, token }) => {
      const params = new URLSearchParams()

      // @ts-ignore
      params.append('id_token_hint', token.idToken)
      fetch(
        `${
          process.env.KEYCLOAK_ISSUER
        }/protocol/openid-connect/logout?${params.toString()}`
      )
    }
  }
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }