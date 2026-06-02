/**
 * ProductCardSkeleton
 * Animated shimmer placeholder matching ProductCard's aspect-[3/4] layout.
 * Drop this wherever ProductCard would appear while data is loading.
 */

import React from "react"

/* ─── Inline keyframe injection ─────────────────────────────────────────── */
// We inject the @keyframes once via a <style> tag so there's no dependency on
// globals.css being updated, and no Tailwind JIT arbitrary keyframe needed.
const SHIMMER_STYLE = `
@keyframes drip-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.drip-shimmer {
  background: linear-gradient(
    90deg,
    #1a1a20 0%,
    #1a1a20 25%,
    #2a2a32 50%,
    #1a1a20 75%,
    #1a1a20 100%
  );
  background-size: 400% 100%;
  animation: drip-shimmer 1.5s ease-in-out infinite;
}
`

function ShimmerStyles() {
  return <style dangerouslySetInnerHTML={{ __html: SHIMMER_STYLE }} />
}

/* ─── Single skeleton card ───────────────────────────────────────────────── */
export function ProductCardSkeleton() {
  return (
    <>
      <ShimmerStyles />
      <div aria-hidden="true" className="w-full">
        {/* Image placeholder – aspect-[3/4] matches ProductCard */}
        <div className="relative w-full aspect-[3/4] overflow-hidden drip-shimmer" />

        {/* Text placeholders */}
        <div className="pt-4 pb-1 flex flex-col gap-2.5">
          {/* Brand label – narrow */}
          <div
            className="h-2 w-16 drip-shimmer"
            style={{ borderRadius: 0 }}
          />
          {/* Product name – two lines */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 w-full drip-shimmer" />
            <div className="h-2.5 w-3/4 drip-shimmer" />
          </div>
          {/* Price */}
          <div className="h-2.5 w-20 drip-shimmer mt-0.5" />
        </div>
      </div>
    </>
  )
}

/* ─── Grid of skeletons ──────────────────────────────────────────────────── */
export function ProductCardSkeletonGrid({
  count = 8,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={
        className ??
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
