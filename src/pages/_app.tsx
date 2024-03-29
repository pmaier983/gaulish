import { useEffect } from "react"
import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"
import { Alegreya } from "next/font/google"
import { useRouter } from "next/router"
import { configureAbly } from "@ably-labs/react-hooks"
import { Toaster } from "react-hot-toast"
import { Analytics } from "@vercel/analytics/react"

import { AUTH_FREE_PAGES } from "~/components/constants"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useGlobalStore } from "~/state/globalStore"
import { api } from "~/utils/api"

import "~/styles/globals.css"
import { ABLY_CLIENT_ID } from "~/utils"
import { useSpritesheet } from "~/hooks/useSpritesheet"

// This is a variable font https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
const Font = Alegreya({
  subsets: ["latin"],
  variable: "--default-font",
  preload: true,
})

// See: https://github1s.com/vercel/next.js/blob/canary/examples/with-ably

configureAbly({
  authUrl: `${process.env.NEXTAUTH_URL ?? ""}/api/auth/createTokenRequest`,
  clientId: ABLY_CLIENT_ID, // TODO: Make Client ID contain some useful info (like username!?)
})

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { status } = useSession()
  const { setIsUserAdmin } = useGlobalStore((state) => ({
    setIsUserAdmin: state.setIsUserAdmin,
  }))

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
    status !== "authenticated" &&
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
  // Start loading spritesheet data ASAP!
  useSpritesheet()

  return (
    <>
      <SessionProvider session={session}>
        <div className={`flex h-full flex-col ${Font.className}`}>
          <AuthWrapper>
            <Toaster position="bottom-center" />
            <Component {...rest} />
          </AuthWrapper>
        </div>
      </SessionProvider>
      <Analytics />
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default api.withTRPC(MyApp)
