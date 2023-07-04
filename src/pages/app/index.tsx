import { signOut, useSession } from "next-auth/react"

import styles from "./index.module.css"

const App = () => {
  const { data } = useSession()

  return (
    <div className={styles.container}>
      <div className="bg-red-100">Details</div>
      <div className={styles.mainContent}>
        <div className={styles.mainContentSidebar}>Small Stuff</div>
        <div>Map</div>
      </div>
      <div className="bg-blue-100">Chat & Log</div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App
