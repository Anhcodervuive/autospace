import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { MyCompanyDocument } from '@autospace/network/src/gql/generated'
import { AlertSection } from '../molecules/AlertSection'
import { CreateCompany } from './CreateCompany'
import { ReactNode } from 'react'

type RenderPropChild = (id: number) => ReactNode

export const IsManager = async ({
    children,
}: {
    children: RenderPropChild | ReactNode
}) => {
    const client = await getApolloServerClient()
    const { data } = await client.query({
        query: MyCompanyDocument,
        fetchPolicy: 'no-cache',
    })

    if (!data?.myCompany)
        return (
            <AlertSection>
                <div>You don&apos;t have a company yet.</div>
                <CreateCompany />
            </AlertSection>
        )

    return (
        <>
            {typeof children === 'function'
                ? (children as RenderPropChild)(data.myCompany.id)
                : children}
        </>
    )
}
