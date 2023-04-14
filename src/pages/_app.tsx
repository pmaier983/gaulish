import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { Poppins } from "@next/font/google"

import { api } from "~/utils/api"

const sortsMillGoudy = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
})

import "~/styles/globals.css"

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={`h-full ${sortsMillGoudy.className}`}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  )
}

export default api.withTRPC(MyApp)
