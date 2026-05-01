import {
    BookingStatus,
    BookingsForCustomerDocument,
} from '@autospace/network/src/gql/generated'
import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from './ShowData'
import { CustomerBookingCard } from './CustomerBookingCard'

const loadCustomerBookings = async (statuses: BookingStatus[], skip: number, take: number) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: BookingsForCustomerDocument,
            variables: {
                skip,
                take,
                where: {
                    status: {
                        in: statuses,
                    },
                },
            },
            fetchPolicy: 'no-cache',
        })

        return {
            bookings: data?.bookingsForCustomer ?? [],
            totalCount: data?.bookingsCount.count ?? 0,
            error: undefined,
        }
    } catch (error) {
        return {
            bookings: [],
            totalCount: 0,
            error: error instanceof Error ? error.message : 'Failed to load bookings.',
        }
    }
}

export const ShowCustomerBookings = async ({
    page,
    statuses,
}: {
    page: number
    statuses: BookingStatus[]
}) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { bookings, totalCount, error } = await loadCustomerBookings(
        statuses,
        skip,
        take,
    )

    return (
        <ShowData
            error={error}
            resultCount={bookings.length}
            pagination={{
                page,
                pageSize: take,
                totalCount,
            }}
        >
            {bookings.map((booking) => (
                <CustomerBookingCard key={booking.id} booking={booking} />
            ))}
        </ShowData>
    )
}
