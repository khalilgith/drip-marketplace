export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Full-screen layout — each auth page manages its own split
  return <>{children}</>
}
