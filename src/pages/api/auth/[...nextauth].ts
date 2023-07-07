import NextAuth from "next-auth"
import { authOptions } from "~/server/auth"

// Export Next-Auth
// eslint-disable-next-line import/no-default-export
export default NextAuth(authOptions)
