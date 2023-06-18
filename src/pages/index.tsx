import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

import styles from "./index.module.css"

// Setup i18n
// Setup Fonts
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gaulish.io</title>
        <meta
          name="description"
          content="Explore the seas and trade or travel your way to riches"
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
  const { data: sessionData, status } = useSession()

  const isLoggedIn = !!sessionData

  return (
    <div className="flex h-full items-center justify-center">
      <div className={styles.signInCard}>
        <div className={styles.signInBackground}>
          {Array(9)
            .fill(null)
            .map((_, i) => (
              <div key={i} className={styles.styledBox} />
            ))}
        </div>
        {isLoggedIn || status === "loading" ? (
          <Link
            href="/app"
            className="padding self-center p-8 text-center text-3xl"
          >
            To App
          </Link>
        ) : (
          <button
            className="text-center text-3xl"
            onClick={() => void signIn(undefined, { callbackUrl: "/app" })}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  )
}
