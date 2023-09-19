import * as Dialog from "@radix-ui/react-dialog"

interface DialogWrapperProps {
  children: React.ReactNode
  className?: string
}

export const DialogWrapper = ({ children, className }: DialogWrapperProps) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" />
    <Dialog.Content
      className={`${className} outline-3 fixed left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] rounded bg-white shadow-lg outline outline-black `}
    >
      {children}
    </Dialog.Content>
  </Dialog.Portal>
)
