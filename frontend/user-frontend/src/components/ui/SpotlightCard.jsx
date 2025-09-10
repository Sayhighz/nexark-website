"use client"

import React from 'react'

export const SpotlightCard = ({
  children,
  hsl,
  hslMin = 200,
  hslMax = 280,
  from = "#1cd1c6",
  via = "#407cff",
  size = 300,
  className = "",
  ...props
}) => {
  const background = hsl
    ? `hsl(${hslMin} 100% 50% / 0.1), hsl(${hslMax} 100% 50% / 0.1)`
    : `radial-gradient(${size}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${from}, ${via}, transparent 40%)`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background,
      }}
      {...props}
    >
      {hsl && (
        <div className="absolute inset-0 bg-[radial-gradient(40%_128px_at_50%_0%,theme(backgroundColor.white/5%),transparent)]"></div>
      )}
      {children}
    </div>
  )
}