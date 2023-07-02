import { Stage, type _ReactPixi, useApp } from "@pixi/react"
import { useEffect } from "react"
import * as PIXI from "pixi.js"

interface PixiStage extends _ReactPixi.IStage {
  children?: React.ReactNode
}

export const PixiStage = ({ children, ...rest }: PixiStage) => {
  return (
    <Stage {...rest}>
      <EventsProvider>{children}</EventsProvider>
    </Stage>
  )
}

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const app = useApp()


  useEffect(() => {
    // Install EventSystem, if not already
    // (PixiJS 6 doesn't add it by default)
    if (app && !app.renderer.events) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      app.renderer.addSystem(PIXI.EventSystem, "events")
    }
  }, [app])

  return <>{children}</>
}
