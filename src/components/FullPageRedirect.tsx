import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

export const FullPageRedirect = () => {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <h1>You must sign in to view this page</h1>
      <button
        className="text-center text-2xl"
        onClick={() => void signIn('google', { callbackUrl: router.pathname })}
      >
        Sign in
      </button>
    </div>
  )
}
