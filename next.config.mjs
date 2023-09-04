import withRoutes from "nextjs-routes/config"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  // TODO: setup i18n properly (ideally compile time to eventually work with /app)
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    // Openai Dall-E Image url's
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        port: "",
        pathname: "/private/**",
      },
    ],
  },
}

const enableRoutesTypes = withRoutes({ outDir: "types" })

// eslint-disable-next-line import/no-default-export
export default enableRoutesTypes(config)
