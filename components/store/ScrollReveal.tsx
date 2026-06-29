"use client"

import { motion, type Variants } from "framer-motion"
import { useRef } from "react"

type Direction = "up" | "down" | "left" | "right" | "none"
type AnimationVariant = "fade" | "slide" | "scale" | "stagger"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  distance?: number
  variant?: AnimationVariant
  stagger?: boolean
  staggerDelay?: number
  once?: boolean
}

const defaultEasing = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 32,
  stagger = false,
  staggerDelay = 0.08,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null)

  const getVariants = (): Variants => {
    const hidden: Record<string, number | string> = { opacity: 0 }
    if (direction === "up") hidden.y = distance
    else if (direction === "down") hidden.y = -distance
    else if (direction === "left") hidden.x = distance
    else if (direction === "right") hidden.x = -distance

    const visible = {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: defaultEasing,
        delay,
      },
    }

    if (stagger) {
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    }

    return { hidden, visible }
  }

  const variants = getVariants()

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-40px" }}
        variants={variants}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
    >
      {children}
    </motion.div>
  )
}

export const revealItem = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.08,
      ease: defaultEasing,
    },
  }),
}

export const fadeSlideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: defaultEasing },
  },
}

export const fadeSlideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: defaultEasing },
  },
}

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: defaultEasing },
  },
}
