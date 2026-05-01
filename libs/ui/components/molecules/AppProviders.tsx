'use client'

import { ReactNode } from 'react'
import { ApolloProvider } from '@autospace/network/src/config/apollo-client'
import { SessionProvider } from './SessionProvider'
import { ToastContainer } from './Toast'

export const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider>
            <ApolloProvider>
                {children}
                <ToastContainer />
            </ApolloProvider>
        </SessionProvider>
    )
}
