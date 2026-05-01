import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { ValetMeDocument } from '@autospace/network/src/gql/generated'
import { AlertSection } from '../molecules/AlertSection'
import { ReactNode } from 'react'

type RenderPropChild = (id: number) => ReactNode

export const IsValet = async ({
    children,
    uid,
}: {
    children: RenderPropChild | ReactNode
    uid?: string
}) => {
    const client = await getApolloServerClient()
    const { data } = await client.query({
        query: ValetMeDocument,
        fetchPolicy: 'no-cache',
    })

    if (!data?.valetMe?.companyId)
        return (
            <AlertSection>
                <div>You are not a valet.</div>
                <div>Please contact the company&apos;s managers with your ID. </div>
                <div>{uid}</div>
            </AlertSection>
        )

    return (
        <>
            {typeof children === 'function'
                ? (children as RenderPropChild)(data.valetMe.companyId)
                : children}
        </>
    )
}
