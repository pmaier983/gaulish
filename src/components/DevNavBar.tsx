import Link from "next/link"
import { useCallback, useState } from "react"
import { useGamestateStore } from "~/state/gamestateStore"
import { useGlobalStore } from "~/state/globalStore"

export const DevNavBar = () => {
  const [hasHideDevNavBar, setHasHideDevNavBar] = useState(false)
  const globalState = useGlobalStore(useCallback((state) => state, []))
  const gameState = useGamestateStore(useCallback((state) => state, []))

  if (!globalState.isUserAdmin || hasHideDevNavBar) {
    return null
  }

  return (
    <div className="absolute flex h-8 w-full justify-center gap-6 overflow-hidden bg-slate-100 py-1 opacity-75">
      <button
        onClick={() =>
          setHasHideDevNavBar(
            (currentNavBarVisibility) => !currentNavBarVisibility,
          )
        }
        className="rounded-sm bg-emerald-400 px-3"
      >
        Hide
      </button>
      <Link href="/app" className="rounded-sm bg-slate-400 px-3">
        App
      </Link>
      <button
        className="rounded-sm bg-blue-400 px-3"
        onClick={() => {
          console.log({ gameState, globalState })
        }}
      >
        Console State
      </button>
    </div>
  )
}
