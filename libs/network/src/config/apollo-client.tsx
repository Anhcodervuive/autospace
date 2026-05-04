'use client';

import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
} from '@apollo/client'
import { ApolloProvider as Provider } from "@apollo/client/react";
import { ReactNode, useState } from 'react'
import { setContext } from '@apollo/client/link/context'

export interface IApolloProviderProps {
    children: ReactNode
}

export const createApolloClient = () => {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
    })

    const authLink = setContext(async (_, { headers }) => {
        const token = await fetch('/api/auth/token').then((res) => res.json())

        console.log('token: ', token);

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
                'apollo-require-preflight': 'true',
            },
        }
    })

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    })
}

export const ApolloProvider = ({ children }: IApolloProviderProps) => {
    const [apolloClient] = useState(createApolloClient)

    return <Provider client={apolloClient}>{children}</Provider>
}
