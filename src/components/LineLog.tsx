import { useAtom } from "jotai"
import { useEffect } from "react"
import { haveLogsUpdatedAtom } from "~/state/atoms"

export const LineLog = () => {
  const [haveLogsUpdated, setHaveLogsUpdated] = useAtom(haveLogsUpdatedAtom)

  /**
   * Once the user sees the new logs, reset the flag
   */
  useEffect(() => {
    if (haveLogsUpdated) {
      setHaveLogsUpdated(false)
    }
  }, [haveLogsUpdated, setHaveLogsUpdated])

  return (
    <div className="flex flex-1 self-end">
      <div>Line Log</div>
    </div>
  )
}
