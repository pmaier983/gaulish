import { type Adapter } from "next-auth/adapters"
import { account, example } from "~/../schema"
import { db } from "./db"

/** @return { import("next-auth/adapters").Adapter } */
export const mysqlAdapter = (options = {}): Adapter => {
  return {
    async createUser(user) {
      console.log("createUser - next-auth adapter")
      return
    },
    async getUser(id) {
      console.log("getUser - next-auth adapter")
      return
    },
    async getUserByEmail(email) {
      console.log("getUserByEmail - next-auth adapter")
      return
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log("getUserByAccount - next-auth adapter")
      return
    },
    async updateUser(user) {
      console.log("updateUser - next-auth adapter")
      return
    },
    async deleteUser(userId) {
      console.log("deleteUser - next-auth adapter")
      return
    },
    async linkAccount(account) {
      console.log("linkAccount - next-auth adapter")
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log("unlinkAccount - next-auth adapter")
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log("createSession - next-auth adapter")
      return
    },
    async getSessionAndUser(sessionToken) {
      console.log("getSessionAndUser - next-auth adapter")
      return
    },
    async updateSession({ sessionToken }) {
      console.log("updateSession - next-auth adapter")
      return
    },
    async deleteSession(sessionToken) {
      console.log("deleteSession - next-auth adapter")
      return
    },
    async createVerificationToken({ identifier, expires, token }) {
      console.log("createVerificationToken - next-auth adapter")
      return
    },
    async useVerificationToken({ identifier, token }) {
      console.log("useVerificationToken - next-auth adapter")
      return
    },
  }
}
