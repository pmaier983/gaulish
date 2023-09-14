import * as Dialog from "@radix-ui/react-dialog"

interface DialogWrapperProps {
  children: React.ReactNode
  className?: string
}

export const DialogWrapper = ({ children, className }: DialogWrapperProps) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" />
    <Dialog.Content
      className={`${className} fixed left-[50%] top-[50%] w-[75%] translate-x-[-50%] translate-y-[-50%] bg-white shadow-lg `}
    >
      {children}
    </Dialog.Content>
  </Dialog.Portal>
)
