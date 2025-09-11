import { createContext, useEffect, useRef, useState, useContext, useMemo } from "react"
import { usePrevious, useWindowScroll, useWindowSize } from "react-use"

const ScrollObserverContext = createContext()
const TriggerGroupContext = createContext()
const ReactorGroupContext = createContext()

function Root({ as = "div", children, className, ...props }) {
  const Component = as;
  const [active, setActive] = useState(null)
  const previous = usePrevious(active)
  const isHidden = useMemo(() => active === null, [active])

  const context = {
    active,
    setActive,
    previous,
  }

  return (
    <ScrollObserverContext.Provider value={context}>
      <Component className={className} {...props}>
        {typeof children === "function" ? children(isHidden) : children}
      </Component>
    </ScrollObserverContext.Provider>
  )
}

function TriggerGroup({ as = "div", children, className, ...props }) {
  const Component = as;
  const container = useRef(null)

  const [childElements, setChildElements] = useState([])

  useEffect(() => {
    if (container.current) {
      setChildElements(Array.from(container.current.children))
    }
  }, [])

  const context = { peers: childElements }

  return (
    <TriggerGroupContext.Provider value={context}>
      <Component ref={container} className={className} {...props}>
        {children}
      </Component>
    </TriggerGroupContext.Provider>
  )
}

function Trigger({ as = "div", children, className, ...props }) {
  const Component = as;
  const container = useRef(null)

  const scrollObserverContext = useContext(ScrollObserverContext)
  const triggerGroupContext = useContext(TriggerGroupContext)

  // current element index
  const index = useMemo(() => {
    return triggerGroupContext.peers ? triggerGroupContext.peers.indexOf(container.current) : -1
  }, [triggerGroupContext.peers])

  const isFirst = useMemo(() => index === 0, [index])
  const isLast = useMemo(() => index === triggerGroupContext.peers.length - 1, [index])

  // active element
  const isActive = useMemo(() => scrollObserverContext.active === index, [scrollObserverContext.active])

  // component logic
  const { height: windowHeight } = useWindowSize()
  const { y: windowScroll } = useWindowScroll()

  const [y, setY] = useState(-1)
  const [height, setHeight] = useState(-1)

  useEffect(() => {
    setY(container.current.getBoundingClientRect().top)
    setHeight(container.current.getBoundingClientRect().height)
  }, [windowScroll])

  const isVisible = useMemo(() => {
    return y > windowHeight / 2 - height && y <= windowHeight / 2
  }, [windowHeight, y, height])

  useEffect(() => {
    if (isVisible) {
      scrollObserverContext.setActive(index)
    } else if (isFirst && y > windowHeight / 2 - height) {
      scrollObserverContext.setActive(null)
    } else if (isLast && y <= windowHeight / 2) {
      scrollObserverContext.setActive(null)
    }
  }, [isVisible, isFirst, isLast, y, windowHeight, height, index, scrollObserverContext])

  return (
    <Component ref={container} className={className} {...props}>
      {children(isActive)}
    </Component>
  )
}

export function ReactorGroup({ as = "div", children, className, ...props }) {
  const Component = as;
  const container = useRef(null)

  const [childElements, setChildElements] = useState([])

  useEffect(() => {
    if (container.current) {
      setChildElements(Array.from(container.current.children))
    }
  }, [])

  const context = { peers: childElements }

  return (
    <ReactorGroupContext.Provider value={context}>
      <Component ref={container} className={className} {...props}>
        {children}
      </Component>
    </ReactorGroupContext.Provider>
  )
}

export function Reactor({ as = "div", children, className, ...props }) {
  const Component = as;
  const container = useRef(null)

  const scrollObserverContext = useContext(ScrollObserverContext)
  const reactorGroupContext = useContext(ReactorGroupContext)

  const index = useMemo(() => {
    return reactorGroupContext.peers ? reactorGroupContext.peers.indexOf(container.current) : -1
  }, [reactorGroupContext.peers])

  // active element
  const isActive = useMemo(() => scrollObserverContext.active === index, [scrollObserverContext.active])

  return (
    <Component ref={container} className={className} {...props}>
      {children(isActive)}
    </Component>
  )
}

export const ScrollObserver = Object.assign(Root, { TriggerGroup, Trigger, ReactorGroup, Reactor })
export default ScrollObserver