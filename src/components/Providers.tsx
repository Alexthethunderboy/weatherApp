"use client"

import { QueryClient, QueryClientProvider } from "react-query"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

