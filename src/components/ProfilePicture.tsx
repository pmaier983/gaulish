import * as Avatar from "@radix-ui/react-avatar"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

import staticDefaultProfilePicture from "~/../public/wingedHelmet.webp"

interface ProfilePictureProps {
  className?: string
}

export const ProfilePicture = ({ className }: ProfilePictureProps) => {
  const { data } = useSession()

  if (!data?.user) return null

  return (
    <div className={className}>
      <Avatar.Root onClick={void signOut} className="cursor-pointer">
        <Avatar.Image
          className="rounded-full border-2 border-solid border-black"
          src={data?.user?.image ?? ""}
          alt={data?.user?.name ?? ""}
        />
        <Avatar.Fallback delayMs={300}>
          <Image
            className="rounded-full border-2 border-solid border-black"
            src={staticDefaultProfilePicture}
            alt="a helmet with wings on it, they symbol of gaulish.io"
            width={100}
            height={100}
            placeholder="blur"
          />
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  )
}
