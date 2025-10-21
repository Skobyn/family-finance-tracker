import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement } from 'react'

import { ThemeProvider } from '@/components/theme-provider'

// Mock Firebase Auth Provider
const MockFirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// Mock providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockFirebaseAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </MockFirebaseAuthProvider>
  )
}

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
