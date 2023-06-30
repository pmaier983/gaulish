import { useSession } from "next-auth/react"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { MapCreation } from "~/components/MapCreation"

const Dev = () => {
  const { data } = useSession()

  if (data?.user.email !== "pmaier983@gmail.com") {
    return <FullPageRedirect />
  }

  return (
    <>
      <MapCreation />
    </>
  )
}

export default Dev
