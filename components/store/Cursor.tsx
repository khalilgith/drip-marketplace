"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    dot.style.display  = "block"
    ring.style.display = "block"

    let tx = -100, ty = -100
    let rx = -100, ry = -100
    let rafId: number

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      dot.style.transform = `translate(${tx - 3}px, ${ty - 3}px)`
    }

    const tick = () => {
      rx += (tx - rx) * 0.12
      ry += (ty - ry) * 0.12
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const expand   = () => ring.classList.add("cursor-ring--hover")
    const contract = () => ring.classList.remove("cursor-ring--hover")

    const bindHovers = () => {
      document.querySelectorAll("a, button, [role='button'], label").forEach(el => {
        el.addEventListener("mouseenter", expand)
        el.addEventListener("mouseleave", contract)
      })
    }
    bindHovers()
    const mo = new MutationObserver(bindHovers)
    mo.observe(document.body, { childList: true, subtree: true })

    window.addEventListener("mousemove", onMove)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafId)
      mo.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  style={{ display: "none" }} />
      <div ref={ringRef} className="cursor-ring" style={{ display: "none" }} />
    </>
  )
}
