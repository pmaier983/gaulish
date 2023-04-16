import { type NextPage } from "next"
import Head from "next/head"
import { signIn, signOut, useSession } from "next-auth/react"

import { api } from "~/utils/api"
import Link from "next/link"

// Setup i18n
// Setup Fonts
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gaulish.io</title>
        <meta
          name="description"
          content="TODO: write a description for whatever this is"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <LandingPage />
      </main>
    </>
  )
}

export default Home

// Logged in message questioning?
const LandingPage: React.FC = () => {
  const { data: sessionData } = useSession()

  const isLoggedIn = !!sessionData

  return (
    <div className="flex h-full items-center justify-center">
      {isLoggedIn ? (
        <button onClick={() => void signIn(undefined, { callbackUrl: "/app" })}>
          Sign in
        </button>
      ) : (
        <Link href="/app">To App</Link>
      )}
    </div>
  )
}
