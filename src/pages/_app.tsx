import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider, signIn, useSession } from "next-auth/react"
import { Poppins } from "next/font/google"
import { useRouter } from "next/router"

import { api } from "~/utils/api"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
})

import "~/styles/globals.css"
import { AUTH_FREE_PAGES } from "~/components/constants"

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { status } = useSession()

  if (
    status === "unauthenticated" &&
    !AUTH_FREE_PAGES.includes(router.pathname)
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <h1>You must sign in to view this page</h1>
        <button
          className="text-center text-2xl"
          onClick={() =>
            void signIn(undefined, { callbackUrl: router.pathname })
          }
        >
          Sign in
        </button>
      </div>
    )
  }

  return children
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session },
  ...rest
}) => (
  <SessionProvider session={session}>
    <div className={`h-full ${poppins.className}`}>
      <AuthWrapper>
        <Component {...rest} />
      </AuthWrapper>
    </div>
  </SessionProvider>
)

export default api.withTRPC(MyApp)
