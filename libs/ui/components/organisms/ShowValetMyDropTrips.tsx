import {
    BookingStatus,
    MyDropTripsDocument,
    SortOrder,
} from '@autospace/network/src/gql/generated'
import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from './ShowData'
import { ValetTripCard } from './ValetTripCard'
import { Reveal } from '../molecules/Reveal'
import { AssignValetButton } from './AssignValetButton'

const loadMyDropTrips = async (uid: string, skip: number, take: number) => {
    try {
        const client = await getApolloServerClient()
        const { data } = await client.query({
            query: MyDropTripsDocument,
            variables: {
                skip,
                take,
                orderBy: { endTime: SortOrder.Asc },
                where: {
                    BookingTimeline: {
                        none: {
                            status: BookingStatus.ValetReturned,
                        },
                    },
                    ValetAssignment: {
                        is: {
                            returnValetId: { equals: uid },
                        },
                    },
                },
            },
            fetchPolicy: 'no-cache',
        })

        return {
            bookings: data?.bookingsForValet ?? [],
            totalCount: data?.bookingsCount.count ?? 0,
            error: undefined,
        }
    } catch (error) {
        return {
            bookings: [],
            totalCount: 0,
            error: error instanceof Error ? error.message : 'Failed to load drop trips.',
        }
    }
}

export const ShowValetMyDropTrips = async ({
    uid,
    page,
}: {
    uid: string
    page: number
}) => {
    const take = TAKE_COUNT
    const skip = (page - 1) * take
    const { bookings, totalCount, error } = await loadMyDropTrips(uid, skip, take)

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
                    end={{
                        lat: booking.valetAssignment?.returnLat || undefined,
                        lng: booking.valetAssignment?.returnLng || undefined,
                    }}
                    start={booking.slot.garage.address}
                >
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-xl font-semibold ">
                                {booking.vehicleNumber}
                            </div>

                            <Reveal
                                secret={booking.passcode}
                                showIntruction={false}
                                className="w-full"
                            />
                        </div>

                        <div className="text-sm">
                            {booking.status?.split('_').join(' ')}
                        </div>

                        {[
                            BookingStatus.ValetAssignedForCheckIn,
                            BookingStatus.CheckedOut,
                        ].includes(booking.status) ? (
                            <AssignValetButton
                                bookingId={booking.id}
                                status={BookingStatus.ValetReturned}
                            >
                                Drop
                            </AssignValetButton>
                        ) : null}
                    </div>
                </ValetTripCard>
            ))}
        </ShowData>
    )
}
