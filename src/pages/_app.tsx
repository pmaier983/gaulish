import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { Poppins } from "next/font/google"

import { api } from "~/utils/api"

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
})

import "~/styles/globals.css"

const MyAppWrapper = ({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) => {
  // TODO redirect if user is not logged in an trying to access /app

  return (
    <div className={`h-full ${poppins.className}`}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </div>
  )
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  ...rest
}) => (
  <MyAppWrapper session={rest.pageProps.session}>
    <Component {...rest} />
  </MyAppWrapper>
)

export default api.withTRPC(MyApp)
