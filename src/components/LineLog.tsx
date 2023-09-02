import { useAtom } from "jotai"
import { useEffect } from "react"

import { LOG_PAGE_SIZE } from "~/components/constants"
import { haveLogsUpdatedAtom } from "~/state/atoms"
import { api } from "~/utils/api"

export const LineLog = () => {
  const [haveLogsUpdated, setHaveLogsUpdated] = useAtom(haveLogsUpdatedAtom)

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    api.logs.getLogs.useInfiniteQuery(
      {
        limit: LOG_PAGE_SIZE,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: Infinity,
      },
    )

  /**
   * Once the user sees the new logs, reset the flag
   */
  useEffect(() => {
    if (haveLogsUpdated) {
      setHaveLogsUpdated(false)
    }
  }, [haveLogsUpdated, setHaveLogsUpdated])

  const logs = data?.pages.map((page) => page.logs).flat()

  const isLoadingInitialPage = isLoading && !isFetchingNextPage

  return (
    <div className="flex flex-1 gap-3 overflow-y-auto pt-3">
      <div className="flex flex-1 flex-col-reverse overflow-y-auto p-2">
        {isLoadingInitialPage && <div>Loading...</div>}
        {logs?.map((log) => (
          <div key={log.id}>
            {log.createdAt?.toLocaleTimeString(undefined, {
              month: "short",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            - {log.text}
          </div>
        ))}
        {hasNextPage && (
          <button
            disabled={isFetchingNextPage}
            className="bg-blue-200 outline outline-1"
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "More"}
          </button>
        )}
      </div>
    </div>
  )
}
