import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"
import { Poppins } from "next/font/google"
import { useRouter } from "next/router"

import { AUTH_FREE_PAGES } from "~/components/constants"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { DevNavBar } from "~/components/DevNavBar"
import { api } from "~/utils/api"

import "~/styles/globals.css"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
})

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { status } = useSession()

  if (
    status === "unauthenticated" &&
    !AUTH_FREE_PAGES.includes(router.pathname)
  ) {
    return <FullPageRedirect />
  }

  return children
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session },
  ...rest
}) => {
  return (
    <SessionProvider session={session}>
      <div className={`h-full ${poppins.className}`}>
        <AuthWrapper>
          <DevNavBar />
          <Component {...rest} />
        </AuthWrapper>
      </div>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
