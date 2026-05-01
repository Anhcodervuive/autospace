import {
    GaragesDocument,
    MyCompanyQuery,
} from '@autospace/network/src/gql/generated'
import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from './ShowData'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { GarageCard } from './GarageCard'
import { createApolloClient } from '@autospace/network/src/config/apollo-client'

const loadGarages = async (companyId: MyCompanyQuery['myCompany']['id'], skip: number, take: number) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: GaragesDocument,
            variables: {
                skip,
                take,
                where: { companyId: { equals: companyId } },
            },
            fetchPolicy: 'no-cache',
        })

        return {
            garages: data?.garages ?? [],
            totalCount: data?.garagesCount.count ?? 0,
            error: undefined,
        }
    } catch (error) {
        return {
            garages: [],
            totalCount: 0,
            error:
                error instanceof Error ? error.message : 'Failed to load garages.',
        }
    }
}

export const ListGarages = async ({
    companyId,
    page,
}: {
    companyId: MyCompanyQuery['myCompany']['id']
    page: number
}) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { garages, totalCount, error } = await loadGarages(companyId, skip, take)
    const title = (
        <div className="flex items-center gap-4">
            <div>Garages</div>
            <Link
                href="/new-garage"
                className="rounded-full border border-black p-0.5"
            >
                <IconPlus />
            </Link>
        </div>
    )

    return (
        <ShowData
            error={error}
            resultCount={garages.length}
            pagination={{
                page,
                pageSize: take,
                totalCount,
            }}
            childrenClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3"
            title={title}
        >
            {garages.map((garage) => (
                <GarageCard key={garage.id} garage={garage} />
            ))}
        </ShowData>
    )
}
