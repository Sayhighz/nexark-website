"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const ScrollObserverContext = createContext()

export function ScrollObserver({ children, className }) {
  const [activeId, setActiveId] = useState(null)
  const [isHidden, setIsHidden] = useState(true)
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            setIsHidden(false)
          }
        })
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    )

    const triggers = container.querySelectorAll('[data-scroll-trigger]')
    triggers.forEach((trigger) => observer.observe(trigger))

    return () => {
      triggers.forEach((trigger) => observer.unobserve(trigger))
    }
  }, [])

  return (
    <ScrollObserverContext.Provider value={{ activeId, isHidden }}>
      <div ref={containerRef} className={className}>
        {typeof children === 'function' ? children(isHidden) : children}
      </div>
    </ScrollObserverContext.Provider>
  )
}

ScrollObserver.TriggerGroup = function TriggerGroup({ children, className }) {
  return <div className={className}>{children}</div>
}

ScrollObserver.Trigger = function Trigger({ id, children, className }) {
  const { activeId } = useContext(ScrollObserverContext)
  const isActive = activeId === id

  return (
    <div
      id={id}
      data-scroll-trigger
      className={className}
    >
      {typeof children === 'function' ? children(isActive) : children}
    </div>
  )
}

ScrollObserver.ReactorGroup = function ReactorGroup({ children, className }) {
  return <div className={className}>{children}</div>
}

ScrollObserver.Reactor = function Reactor({ children, className, index }) {
  const { activeId } = useContext(ScrollObserverContext)
  const isActive = activeId === `features-${index}`

  return (
    <div className={className}>
      {typeof children === 'function' ? children(isActive) : children}
    </div>
  )
}

export default ScrollObserver