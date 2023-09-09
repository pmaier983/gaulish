import * as Dialog from "@radix-ui/react-dialog"
import { Icon } from "~/components/Icon"

// Much of the tailwind css in this file was copied from here:
// https://github1s.com/shadcn-ui/ui/blob/HEAD/apps/www/registry/default/ui/dialog.tsx
export const CityDialog = () => (
  <Dialog.Portal>
    <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]" />
    <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-4 shadow-lg duration-200 sm:rounded-lg md:w-full">
      <Dialog.Title>City Dialog</Dialog.Title>
      <Dialog.Description>City Description</Dialog.Description>
      <Dialog.Close className="focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 ring-offset-black transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
        <Icon id="x" />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
)
