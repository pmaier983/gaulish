import { useSession } from "next-auth/react"
import Link from "next/link"

import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useGlobalStore } from "~/state/globalStore"
import { api } from "~/utils/api"
import { ImageGeneration } from "~/components/ImageGeneration"
import type { GetServerSidePropsContext } from "next"
import { authOptions } from "~/server/auth"
import { getServerSession } from "next-auth"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  }
}

const Dev = () => {
  const { data } = useSession()
  const { isUserAdmin } = useGlobalStore((state) => ({
    isUserAdmin: state.isUserAdmin,
  }))
  const { mutate: setupDefaultGamestate } =
    api.admin.setupDefaultGamestate.useMutation()
  const { mutate: clearDefaultGamestate } =
    api.admin.clearDefaultGamestate.useMutation()

  if (!isUserAdmin) {
    return <FullPageRedirect />
  }

  return (
    <>
      <Link
        href="/app"
        className="h-10 rounded-sm bg-slate-400 px-3 text-center"
      >
        App
      </Link>
      <button
        className="bg-green-300 pt-8"
        onClick={() => setupDefaultGamestate()}
      >
        Setup Default Gamestate
      </button>
      <button
        onClick={() => clearDefaultGamestate()}
        className="bg-red-400 pt-8"
      >
        Remove Default Gamestate
      </button>
      <div>{JSON.stringify(data)}</div>
      <ImageGeneration />
    </>
  )
}

// page export
// eslint-disable-next-line import/no-default-export
export default Dev
