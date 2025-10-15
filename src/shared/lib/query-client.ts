import { QueryClient } from '@tanstack/react-query'

import type { DefaultOptions } from '@tanstack/react-query'

// Define query options type for stricter type-checking
const defaultQueryOptions: DefaultOptions = {
  queries: {
    retry: 2,
    refetchOnWindowFocus: false,
  },
}

const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
})

export default queryClient
