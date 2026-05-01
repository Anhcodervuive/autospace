// apollo-server.ts
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { cookies } from 'next/headers'

export async function getApolloServerClient() {
    const cookieStore = await cookies()

    const isDevelopment = process.env.NODE_ENV === 'development'

    const cookieName = isDevelopment
        ? 'next-auth.session-token'
        : '__Secure-next-auth.session-token'

    const token = cookieStore.get(cookieName)?.value ?? ''

    return new ApolloClient({
        link: new HttpLink({
            uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
            fetch,
            headers: {
                // 👇 nếu backend đọc cookie
                cookie: `${cookieName}=${token}`,

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