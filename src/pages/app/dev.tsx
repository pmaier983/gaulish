import { useSession } from "next-auth/react"
import { FullPageRedirect } from "~/components/FullPageRedirect"

const Dev = () => {
  const { data } = useSession()

  if (data?.user.email !== "pmaier983@gmail.com") {
    return <FullPageRedirect />
  }

  return <div>TODO: fill with dev tools</div>
}

export default Dev
