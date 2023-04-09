// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
import withAuth from "next-auth/middleware"

export default withAuth({
  callbacks: {
    // if the session-token is present let the user in (TODO: not exactly 100% secure)
    authorized: (props) => !!props.req.cookies.has("next-auth.session-token"),
  },
})

export const config = { matcher: ["/app/:path*"] }
