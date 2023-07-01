import React from "react"
import * as PIXI from "pixi.js"
import { Viewport } from "pixi-viewport"
import { PixiComponent, useApp } from "@pixi/react"

export interface ViewportProps {
  width: number
  height: number
  children?: React.ReactNode
}

export interface PixiComponentViewportProps extends ViewportProps {
  app: PIXI.Application
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentViewportProps) => {
    // Install EventSystem, if not already
    // (PixiJS 6 doesn't add it by default)
    if (!("events" in props.app.renderer)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      props.app.renderer.addSystem(PIXI.EventSystem, "events")
    }

    const viewport = new Viewport({
      screenWidth: props.width,
      screenHeight: props.height,
      worldWidth: props.width * 2,
      worldHeight: props.height * 2,
      ticker: props.app.ticker,
      events: props.app.renderer.events,
    })

    viewport.drag().pinch().wheel().clampZoom({})

    return viewport
  },
})

export const PixiViewport = (props: ViewportProps) => {
  const app = useApp()
  return <PixiComponentViewport app={app} {...props} />
}
