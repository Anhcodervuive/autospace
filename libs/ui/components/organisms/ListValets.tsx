import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { CompanyValetsDocument } from '@autospace/network/src/gql/generated'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from './ShowData'
import { ValetCard } from './ValetCard'

const loadValets = async (skip: number, take: number) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: CompanyValetsDocument,
            variables: {
                skip,
                take,
            },
            fetchPolicy: 'no-cache',
        })

        return {
            valets: data?.companyValets ?? [],
            totalCount: data?.companyValetsTotal ?? 0,
            error: undefined,
        }
    } catch (error) {
        return {
            valets: [],
            totalCount: 0,
            error: error instanceof Error ? error.message : 'Failed to load valets.',
        }
    }
}

export const ListValets = async ({ page }: { page: number }) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { valets, totalCount, error } = await loadValets(skip, take)

    return (
        <ShowData
            error={error}
            resultCount={valets.length}
            pagination={{
                page,
                pageSize: take,
                totalCount,
            }}
        >
            {valets.map((valet) => (
                <ValetCard key={valet.uid} valet={valet} />
            ))}
        </ShowData>
    )
}
