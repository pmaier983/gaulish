import { type StoreApi, type UseBoundStore } from "zustand"

export interface ZustandFuncSelectors<StateType> {
  use: {
    [key in keyof StateType]: () => StateType[key]
  }
}

export interface Store<StateType> extends UseBoundStore<StoreApi<StateType>> {
  use: {
    [key in keyof StateType]: () => StateType[key]
  }
}

// Selector Docs: https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
export function createSelectorFunctions<StateType extends object>(
  store: UseBoundStore<StoreApi<StateType>>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const storeIn = store as Store<StateType>

  storeIn.use = {} as { [key in keyof StateType]: () => StateType[key] }

  Object.keys(storeIn.getState()).forEach((key) => {
    const selector = (state: StateType) => state[key as keyof StateType]

    // TODO: figure out how to properly type this
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    storeIn.use[key] = () => storeIn(selector)
  })

  return store as UseBoundStore<StoreApi<StateType>> &
    ZustandFuncSelectors<StateType>
}
