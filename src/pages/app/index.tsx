import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"

import styles from "./index.module.css"

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
        <div className={styles.mapContainer} ref={sizeRef}>
          {/* <Map width={size.height} height={size.height} /> */}
        </div>
      </div>
      <div className="bg-blue-100">Chat & Log</div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App
