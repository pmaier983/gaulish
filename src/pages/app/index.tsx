import { signOut, useSession } from "next-auth/react"

// protected by the next auth middleware
const App = () => {
  const { data } = useSession()

  return (
    <div>
      <h1>
        Welcome to tha Auth protected App: {data?.user.name ?? "Loading..."}
      </h1>
      <button onClick={() => void signOut({ callbackUrl: "/" })}>
        Sign out
      </button>
    </div>
  )
}

export default App
