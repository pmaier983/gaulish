import Ably from "ably/promises"
import type { NextApiRequest, NextApiResponse } from "next"

// export createTokenRequest
// eslint-disable-next-line import/no-default-export
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY as string)
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: req.query.clientId as string,
  })
  res.status(200).json(tokenRequestData)
  client.close()
}
