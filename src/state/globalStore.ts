import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"

import { createUserSlice, type UserSlice } from "./userStore"
import { createSelectorFunctions } from "./selectorFunction"

export type GlobalState = UserSlice


/**
 * This is not shallow by default
 * so avoid this as it will cause unnecessary re-renders.
*/
const useGlobalStoreBase = create<GlobalState>()(
  devtools(
    (...a) => ({
      ...createUserSlice(...a),
    }),
    { name: "global-state" },
  ),
)

/**
 * Access Pattern:
 * const {property} = useGlobalStore(useCallback((state) => ({property: state.property}), []))
 *
 * Anti-Patterns *these will subscribe to all state changes (VERY BAD)*:
 * const state = useGlobalStore() 
 * const {property} = useGlobalStore(state => state) 
 *
 * Shallow Docs: https://github.com/pmndrs/zustand#selecting-multiple-state-slices  
 * Selector useCallback Docs: https://docs.pmnd.rs/zustand/recipes/recipes#memoizing-selectors
 * 
 * The shallow checking version of useGlobalStoreBase
 * this avoid rerenders for collections and arrays
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
