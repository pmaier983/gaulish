import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"
import { Poppins } from "next/font/google"
import { useRouter } from "next/router"
import { createId } from "@paralleldrive/cuid2"
import { configureAbly } from "@ably-labs/react-hooks"

import { AUTH_FREE_PAGES } from "~/components/constants"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { DevNavBar } from "~/components/DevNavBar"
import { api } from "~/utils/api"

import "~/styles/globals.css"
import { useEffect } from "react"
import { useAtom } from "jotai"
import { isUserAdminAtom } from "~/utils/atoms"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
})

// See: https://github1s.com/vercel/next.js/blob/canary/examples/with-ably
const clientId = createId()

configureAbly({
  authUrl: `${process.env.NEXTAUTH_URL ?? ""}/api/auth/createTokenRequest`,
  clientId: clientId,
})

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { status } = useSession()
  const [, setIsUserAdmin] = useAtom(isUserAdminAtom)

  const { data: isUserAdmin } = api.general.isUserAdmin.useQuery(undefined, {
    staleTime: Infinity,
  })

  useEffect(() => {
    setIsUserAdmin(isUserAdmin ?? false)
  }, [isUserAdmin, setIsUserAdmin])

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
      <div className={`flex h-full flex-col bg-blue-300 ${poppins.className}`}>
        <AuthWrapper>
          <DevNavBar />
          <Component {...rest} />
        </AuthWrapper>
      </div>
    </SessionProvider>
  )
}

// eslint-disable-next-line import/no-default-export
export default api.withTRPC(MyApp)
