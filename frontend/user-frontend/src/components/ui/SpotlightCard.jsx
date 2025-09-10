"use client"

import React from 'react'

export const SpotlightCard = ({
  children,
  from = "#1cd1c6",
  via = "#407cff",
  size = 300,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(${size}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${from}, ${via}, transparent 40%)`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}