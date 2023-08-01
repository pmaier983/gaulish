import { useCallback, useEffect } from "react"
import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"
import { Poppins } from "next/font/google"
import { useRouter } from "next/router"
import { configureAbly } from "@ably-labs/react-hooks"
import { Toaster } from "react-hot-toast"

import { AUTH_FREE_PAGES } from "~/components/constants"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useGlobalStore } from "~/state/globalStore"
import { api } from "~/utils/api"

import "~/styles/globals.css"
import { ABLY_CLIENT_ID } from "~/utils/utils"
import { ProfilePicture } from "~/components/ProfilePicture"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
})

// See: https://github1s.com/vercel/next.js/blob/canary/examples/with-ably

configureAbly({
  authUrl: `${process.env.NEXTAUTH_URL ?? ""}/api/auth/createTokenRequest`,
  clientId: ABLY_CLIENT_ID, // TODO: Make Client ID contain some useful info (like username!?)
})

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { status } = useSession()
  const { setIsUserAdmin } = useGlobalStore(
    useCallback(
      (state) => ({
        setIsUserAdmin: state.setIsUserAdmin,
      }),
      [],
    ),
  )

  const { data: isUserAdmin } = api.general.isUserAdmin.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went checking if the user is an admin",
    },
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
      <div className={`flex h-full flex-col ${poppins.className}`}>
        <AuthWrapper>
          <Toaster position="bottom-center" />
          <ProfilePicture className="absolute right-0 h-20 w-20 pr-4 pt-4" />
          <Component {...rest} />
        </AuthWrapper>
      </div>
    </SessionProvider>
  )
}

// eslint-disable-next-line import/no-default-export
export default api.withTRPC(MyApp)
