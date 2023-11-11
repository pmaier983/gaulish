import { atom } from "jotai"
import { type Log } from "schema"

import { type Message } from "~/hooks/useMessageChannel"

import type { SpritesheetState } from "~/hooks/useSpritesheet"

export const chatMessagesAtom = atom<Message[]>([])

export const logsAtom = atom<Log[]>([])

// TODO: is there a way to do this with react-query?
export const haveLogsUpdatedAtom = atom<boolean>(false)

export const spritesheetStateAtom = atom<SpritesheetState>({
  isSpritesheetLoaded: false,
  /**
   * Its significantly more convenient to assume the spritesheet is loaded
   * Its started to be loaded by useSpritesheet all the way up in _app.tsx
   *
   * It also requires a loading screen placed above it using isSpritesheetLoaded
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  spritesheet: {} as any,
})

export const spritesheetAtom = atom(
  (get) => get(spritesheetStateAtom).spritesheet,
)
