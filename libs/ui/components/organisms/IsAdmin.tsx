import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { AdminMeDocument } from '@autospace/network/src/gql/generated'
import { AlertSection } from '../molecules/AlertSection'
import { ReactNode } from 'react'

export const IsAdmin = async ({ children }: { children: ReactNode }) => {
    const client = await getApolloServerClient()
    const { data } = await client.query({
        query: AdminMeDocument,
        fetchPolicy: 'no-cache',
    })

    if (!data?.adminMe?.uid)
        return (
            <AlertSection>
                <div>You are not an admin.</div>
            </AlertSection>
        )

    return <>{children}</>
}
