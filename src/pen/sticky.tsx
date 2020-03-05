import { useState, useRef, useEffect } from "react"

export function useSticky<T = any>(): [boolean, React.RefObject<T>] {
  const [isSticky, setSticky] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) {
        return
      }
      setSticky(ref.current.getBoundingClientRect().top <= 0)
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  return [isSticky, ref]
}
