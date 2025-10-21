import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation'

// Mock router object
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  basePath: '',
  isReady: true,
  isLocaleDomain: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}

// Helper to reset all router mocks
export const resetRouterMocks = () => {
  Object.keys(mockRouter).forEach(key => {
    if (typeof mockRouter[key as keyof typeof mockRouter] === 'function') {
      jest.clearAllMocks()
    }
  })
}

// Helper to set router pathname
export const setMockPathname = (pathname: string) => {
  mockRouter.pathname = pathname
  mockRouter.asPath = pathname
  mockRouter.route = pathname
}

// Helper to set router query params
export const setMockQuery = (query: Record<string, string | string[]>) => {
  mockRouter.query = query
}
