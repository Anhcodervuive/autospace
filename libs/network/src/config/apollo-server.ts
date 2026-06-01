// apollo-server.ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cookies } from 'next/headers'
import { nextAuthSessionCookieName } from './authCookies'

export async function getApolloServerClient() {
    const cookieStore = await cookies()

    const token = cookieStore.get(nextAuthSessionCookieName)?.value ?? ''

    return new ApolloClient({
        link: new HttpLink({
            uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
            fetch,
            headers: {
                // 👇 nếu backend đọc cookie
                cookie: `${nextAuthSessionCookieName}=${token}`,

                // 👇 nếu backend dùng bearer
                authorization: token ? `Bearer ${token}` : '',
            },
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'no-cache',
            },
        },
    })
}