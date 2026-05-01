import {
    BookingStatus,
    BookingsForGarageDocument,
    QueryMode,
} from '@autospace/network/src/gql/generated'
import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { TAKE_COUNT } from '@autospace/util/constants'
import { QuerySearchInput } from '../molecules/QuerySearchInput'
import { ShowData } from './ShowData'
import { ManageBookingCard } from './ManageBookingCard'
import { CheckInOutButton } from './CheckInOutButtons'

const loadGarageBookings = async (
    garageId: number,
    statuses: BookingStatus[],
    searchTerm: string,
    skip: number,
    take: number,
) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: BookingsForGarageDocument,
            variables: {
                skip,
                take,
                where: {
                    status: { in: statuses },
                    Slot: {
                        is: {
                            garageId: { equals: garageId },
                        },
                    },
                    ...(searchTerm && {
                        vehicleNumber: {
                            contains: searchTerm,
                            mode: QueryMode.Insensitive,
                        },
                    }),
                },
            },
            fetchPolicy: 'no-cache',
        })

        return {
            bookings: data?.bookingsForGarage ?? [],
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

export const ShowGarageBookings = async ({
    garageId,
    page,
    searchTerm,
    statuses,
    showCheckIn = false,
    showCheckOut = false,
}: {
    garageId: number
    page: number
    searchTerm: string
    statuses: BookingStatus[]
    showCheckIn?: boolean
    showCheckOut?: boolean
}) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { bookings, totalCount, error } = await loadGarageBookings(
        garageId,
        statuses,
        searchTerm,
        skip,
        take,
    )

    return (
        <div className="mt-4">
            <div className="flex justify-center">
                <QuerySearchInput
                    value={searchTerm}
                    paramName="q"
                    placeholder="Search vehicle number"
                />
            </div>
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
                    <div key={booking.id}>
                        <ManageBookingCard booking={booking} />
                        {showCheckIn ? (
                            <CheckInOutButton
                                status={BookingStatus.CheckedIn}
                                buttonText="CHECK IN"
                                bookingId={booking.id}
                            />
                        ) : null}
                        {showCheckOut ? (
                            <CheckInOutButton
                                status={BookingStatus.CheckedOut}
                                buttonText="CHECK OUT"
                                bookingId={booking.id}
                            />
                        ) : null}
                    </div>
                ))}
            </ShowData>
        </div>
    )
}
