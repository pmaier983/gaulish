import dynamic from "next/dynamic"

import styles from "./index.module.css"
import { useElementSize } from "~/hooks/useElementSize"

const Map = dynamic(() => import("~/components/Map"), {
  ssr: false,
})

const App = () => {
  const { sizeRef, size } = useElementSize()

  console.log(size)

  return (
    <div className={styles.container}>
      <div className="bg-red-100">Details</div>
      <div className={styles.mainContent}>
        <div className={styles.mainContentSidebar}>Small Stuff</div>
        <div className="flex-1 bg-slate-500" ref={sizeRef}>
          <Map width={size.height} height={size.height} />
        </div>
      </div>
      <div className="bg-blue-100">Chat & Log</div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App
