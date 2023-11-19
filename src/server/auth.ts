import { type GetServerSidePropsContext } from "next"
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "~/env.mjs"
import { db } from "./db"
import { mysqlAdapter } from "~/server/mysqlAdapter"

/**
 * List of admin emails
 */
// Consider moving this to a database table or env?
export const ADMINS = ["pmaier983@gmail.com"]

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"]
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: mysqlAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
    /* 
      POSSIBLE TODO: consider re-adding discord auth
      To add discord auth you would need to make a nice alert if they 
      had previously logged in with google. Or handle it otherwise, currently it breaks
      with the following error: "Please try sining in with a different account."
    */
    // DiscordProvider({
    //   clientId: env.DISCORD_OAUTH_CLIENT_ID,
    //   clientSecret: env.DISCORD_OAUTH_CLIENT_SECRET,
    // }),
  ],
  events: {
    signIn(message) {
      if (message.isNewUser) {
        // TODO: new user
      } else {
      }
    },
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
