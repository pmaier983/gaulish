/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": "^[a-z][\\w-]*$",
  },
}

module.exports = config
