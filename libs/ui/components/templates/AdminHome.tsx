import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { GaragesDocument } from '@autospace/network/src/gql/generated'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from '../organisms/ShowData'
import { GarageAdminCard } from '../organisms/GarageAdminCard'
import { CreateVerificationButton } from '../organisms/admin/CreateVerificationButton'
import { RemoveVerificationButton } from '../organisms/admin/RemoveVerificationButton'

const loadGarages = async (skip: number, take: number) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: GaragesDocument,
            variables: { skip, take },
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

export const AdminHome = async ({ page }: { page: number }) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { garages, totalCount, error } = await loadGarages(skip, take)

    return (
        <ShowData
            error={error}
            resultCount={garages.length}
            pagination={{
                page,
                pageSize: take,
                totalCount,
            }}
            title="Garages"
        >
            {garages.map((garage) => (
                <GarageAdminCard key={garage.id} garage={garage}>
                    <div className="flex justify-end">
                        {!garage?.verification?.verified ? (
                            <CreateVerificationButton garageId={garage.id} />
                        ) : (
                            <RemoveVerificationButton garageId={garage.id} />
                        )}
                    </div>
                </GarageAdminCard>
            ))}
        </ShowData>
    )
}
