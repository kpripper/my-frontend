import { CSSProperties, useEffect, useState } from 'react'

const getDefaultStyles = (
  direction: number,
  randomAlpha: number,
  hue: number
) => ({
    background: `linear-gradient(${direction}deg, hsla(192, 98%, 33%,${randomAlpha}), hsla(${hue}, 50%, 50%,${randomAlpha}))`
})
 

export const useBackgroundColor = (): CSSProperties => {
  const [backGroundStyles, setBackgroundStyles] = useState<CSSProperties | null>(null)

  useEffect(() => {
    const direction = Math.round(Math.random() * 360)
    const hue = Math.random() * (192 - 212) + 212
    const randomAlpha = Math.random() * (0.6 - 0.4) + 0.8
    setBackgroundStyles(getDefaultStyles(direction, randomAlpha, hue))
  }, [])

  return backGroundStyles as CSSProperties
}

