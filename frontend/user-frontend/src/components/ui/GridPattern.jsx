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
      className={className}
      {...props}
    >
      <defs>
        <pattern
          id="grid-pattern"
          x={offsetX}
          y={offsetY}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            className="stroke-current"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      {children}
    </svg>
  )
}

const GridPatternBlock = ({ 
  row, 
  column, 
  className = "",
  ...props 
}) => {
  return (
    <rect
      x={column * 64}
      y={row * 64}
      width="64"
      height="64"
      className={className}
      {...props}
    />
  )
}

GridPattern.Block = GridPatternBlock