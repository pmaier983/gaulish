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
      <div className={styles.header}>Details</div>
      <div className={styles.sidebar}>Sidebar</div>
      <div className={styles.main}>main</div>
      <div className={styles.footer}>Chat & Log</div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App
