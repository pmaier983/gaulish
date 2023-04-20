const camelCaseRegex = "^[a-z][\\w-]*$"

/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": camelCaseRegex,
  },
}

module.exports = config
