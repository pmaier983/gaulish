import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"))

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}

module.exports = withVanillaExtract(config)
