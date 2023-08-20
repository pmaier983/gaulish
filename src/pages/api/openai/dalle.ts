import { z } from "zod"
import type { NextApiRequest, NextApiResponse } from "next"

import OpenAI from "openai"
import { ADMINS, getServerAuthSession } from "~/server/auth"
import { type ImageGenerateParams } from "openai/resources"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const dalleInputs = z.custom<ImageGenerateParams>()

// export createTokenRequest
// eslint-disable-next-line import/no-default-export
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (process.env.NODE_ENV !== "development") {
    throw Error("dalle only available in dev mode")
  }

  const session = await getServerAuthSession({ req, res })

  if (!session?.user.email) {
    throw Error("Only a valid user can use the dalle endpoint")
  }

  if (!ADMINS.includes(session.user.email)) {
    throw Error("Only admins can use the dalle endpoint")
  }

  try {
    const parsed = dalleInputs.safeParse(req.body)

    if (parsed.success === false) {
      console.error(
        "❌ Invalid dalle inputs:",
        parsed.error.flatten().fieldErrors,
      )
      throw new Error("Invalid environment variables")
    }

    const response = await openai.images.generate({
      n: 1,
      size: "512x512",
      response_format: "url",
      user: session?.user.email,
      ...parsed.data,
    })

    if (!response) {
      throw new Error("No response")
    }

    res.status(200).json(response.data)
    // TODO: how to properly handle api errors?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const error = e?.response?.data?.error

    res.status(500).json({
      error: error ? JSON.stringify(error) : "Internal Server Error",
    })
  }
}
