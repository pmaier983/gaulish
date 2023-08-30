import { atom } from "jotai"
import { type Log } from "schema"
import { type Message } from "~/hooks/useMessageChannel"

export const chatMessagesAtom = atom<Message[]>([])

export const logsAtom = atom<Log[]>([])

// TODO: is there a way to do this with react-query?
export const haveLogsUpdatedAtom = atom<boolean>(false)
