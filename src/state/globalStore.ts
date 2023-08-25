import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"

import { createUserSlice, type UserSlice } from "./userStore"
import { createSelectorFunctions } from "./selectorFunction"
import { createDisableSlice, type DisableSlice } from "~/state/disableStore"

export type GlobalState = UserSlice & DisableSlice

/**
 * This is not shallow by default
 * so avoid this as it will cause unnecessary re-renders.
 */
export const useGlobalStoreBase = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...createUserSlice(...a),
      ...createDisableSlice(...a),
    }),
    { name: "global-state" },
  ),
)

/**
 * Access Pattern:
 * const {property} = useGlobalStore((state) => ({property: state.property}))
 *
 * Shallow Docs: https://github.com/pmndrs/zustand#selecting-multiple-state-slices
 */
export const useGlobalStore = <U>(selector: (state: GlobalState) => U) => {
  return useGlobalStoreBase(selector, shallow)
}

/**
 * Selector docs: https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
 *
 * These Selectors are mostly for one off use cases
 * I also don't think they are shallow yet, so before using them with an array/collection ->
 * TODO: make selectors shallow
 */
export const useGlobalSelectors = createSelectorFunctions(useGlobalStoreBase)
