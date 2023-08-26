import { atom } from "jotai"
import { type Message } from "~/hooks/useMessageChannel"

// TODO: should this be moved to global state?
export const chatMessagesAtom = atom<Message[]>([])
