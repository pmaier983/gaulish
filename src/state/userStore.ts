import { type StateCreator } from "zustand"

import { type GlobalState } from "./globalStore"

export interface UserSliceState {
  isUserAdmin: boolean
}

interface UserSliceActions {
  setIsUserAdmin: (isUserAdmin: UserSliceState["isUserAdmin"]) => void
}

export type UserSlice = UserSliceActions & UserSliceState

const initialUserSlice: UserSliceState = {
  isUserAdmin: false,
}

export const createUserSlice: StateCreator<GlobalState, [], [], UserSlice> = (
  set,
) => ({
  ...initialUserSlice,

  setIsUserAdmin: (isUserAdmin) => set((state) => ({ ...state, isUserAdmin })),
})
