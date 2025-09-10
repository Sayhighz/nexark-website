"use client"

import React from 'react'

export const GridPattern = ({
  size = 64,
  offsetX = 0,
  offsetY = 0,
  className = "",
  children,
  ...props
}) => {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}' width='${size}' height='${size}'%3e%3cpath d='m0 0v${size}h${size}' fill='none' stroke='currentColor' stroke-width='1'/%3e%3c/svg%3e")`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
      }}
      {...props}
    >
      {children}
    </svg>
  )
}

const Block = ({ row, column, className = "", ...props }) => {
  return (
    <rect
      x={column * 64 - 64}
      y={row * 64 - 64}
      width="64"
      height="64"
      className={className}
      {...props}
    />
  )
}

GridPattern.Block = Block