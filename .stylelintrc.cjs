const camelCaseRegex = "^[a-z][\\w-]*$" // Note: also allows `_` as part of BEM naming

/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": camelCaseRegex,
  },
}

module.exports = config
