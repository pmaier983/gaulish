import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export const DevNavBar = () => {
  const { data } = useSession()

  if (data?.user.email !== "pmaier983@gmail.com") {
    return null
  }

  return (
    <div className="absolute flex h-8 w-full justify-center gap-6 overflow-hidden bg-slate-100 py-1 opacity-75">
      <Link href={"/"} className="rounded-sm bg-slate-400 px-3">
        Home
      </Link>
      <Link href={"/app"} className="rounded-sm bg-slate-400 px-3">
        App
      </Link>
      <Link href={"/app/dev"} className="rounded-sm bg-slate-400 px-3">
        Dev
      </Link>
      <button
        onClick={() => void signOut()}
        className="rounded-sm bg-red-300 px-3"
      >
        Sign Out
      </button>
    </div>
  )
}
