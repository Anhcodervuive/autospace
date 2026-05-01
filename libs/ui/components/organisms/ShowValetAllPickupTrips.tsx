import {
    BookingStatus,
    ValetPickupsDocument,
} from '@autospace/network/src/gql/generated'
import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from './ShowData'
import { ValetTripCard } from './ValetTripCard'
import { AssignValetButton } from './AssignValetButton'

const loadPickupTrips = async (skip: number, take: number) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: ValetPickupsDocument,
            variables: {
                skip,
                take,
            },
            fetchPolicy: 'no-cache',
        })

        return {
            bookings: data?.valetPickups ?? [],
            totalCount: data?.valetPickupsTotal ?? 0,
            error: undefined,
        }
    } catch (error) {
        return {
            bookings: [],
            totalCount: 0,
            error:
                error instanceof Error ? error.message : 'Failed to load pickup trips.',
        }
    }
}

export const ShowValetAllPickupTrips = async ({ page }: { page: number }) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { bookings, totalCount, error } = await loadPickupTrips(skip, take)

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
                <ValetTripCard
                    key={booking.id}
                    booking={{
                        id: booking.id,
                        time: booking.startTime,
                    }}
                    start={{
                        lat: booking.valetAssignment?.pickupLat,
                        lng: booking.valetAssignment?.pickupLng,
                    }}
                    end={booking.slot.garage.address}
                >
                    <AssignValetButton
                        bookingId={booking.id}
                        status={BookingStatus.ValetAssignedForCheckIn}
                    >
                        Accept
                    </AssignValetButton>
                </ValetTripCard>
            ))}
        </ShowData>
    )
}
