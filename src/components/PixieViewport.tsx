import React from "react"
import type * as PIXI from "pixi.js"
import { Viewport as RawPixieViewport } from "pixi-viewport"
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
    const viewport = new RawPixieViewport({
      screenWidth: props.width,
      screenHeight: props.height,
      worldWidth: props.width * 2,
      worldHeight: props.height * 2,
      ticker: props.app.ticker,
      // TODO: properly type this!
      interaction: props.app.renderer.plugins.interaction,
    })
    viewport.drag().pinch().wheel().clampZoom({})

    return viewport
  },
})

export const PixieViewport = (props: ViewportProps) => {
  const app = useApp()
  return <PixiComponentViewport app={app} {...props} />
}
