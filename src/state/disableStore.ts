import { type StateCreator } from "zustand"

import { type GlobalState } from "./globalStore"

export interface DisableSliceState {
  isLeaderboardDisabled: boolean
  isSidebarDisabled: boolean
  isChatDisabled: boolean
  isMapDisabled: boolean
}

interface DisableSliceActions {
  setDisableState: (newDisableState: DisableSliceState) => void
}

export type DisableSlice = DisableSliceActions & DisableSliceState

const initialDisableState: DisableSliceState = {
  isLeaderboardDisabled: false,
  isSidebarDisabled: false,
  isChatDisabled: false,
  isMapDisabled: false,
}

export const createDisableSlice: StateCreator<
  GlobalState,
  [],
  [],
  DisableSlice
> = (set) => ({
  ...initialDisableState,

  setDisableState: (newDisableState) =>
    set((state) => ({ ...state, ...newDisableState })),
})
