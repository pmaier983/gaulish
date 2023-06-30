import Link from "next/link"

export const DevNavBar = () => {
  return (
    <div className="flex h-8 w-full justify-center gap-6 bg-slate-100 py-1">
      <Link href={"/"} className="rounded-sm bg-slate-400 px-3">
        Home
      </Link>
      <Link href={"/app"} className="rounded-sm bg-slate-400 px-3">
        App
      </Link>
      <Link href={"/app/dev"} className="rounded-sm bg-slate-400 px-3">
        Dev
      </Link>
    </div>
  )
}
