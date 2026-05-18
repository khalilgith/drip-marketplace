"use client"

import { useEffect } from "react"

export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    const reveals = document.querySelectorAll(".reveal")
    reveals.forEach((el) => observer.observe(el))

    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll(".reveal:not(.observed)").forEach((el) => {
        el.classList.add("observed")
        observer.observe(el)
      })
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}
