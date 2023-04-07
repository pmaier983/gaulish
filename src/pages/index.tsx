import { type NextPage } from "next"
import Head from "next/head"
import { signIn, signOut, useSession } from "next-auth/react"

import { api } from "~/utils/api"

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
      <main>
        <AuthShowcase />
      </main>
    </>
  )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession()

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  )

  api.example.getAll.useQuery()

  return (
    <div className="flex flex-col items-start">
      <p>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  )
}
