import {
  BookingStatus,
  ValetDropsDocument,
} from '@autospace/network/src/gql/generated'
import { getApolloServerClient } from '@autospace/network/src/config/apollo-server'
import { TAKE_COUNT } from '@autospace/util/constants'
import { ShowData } from './ShowData'
import { ValetTripCard } from './ValetTripCard'
import { AssignValetButton } from './AssignValetButton'

const loadDropTrips = async (skip: number, take: number) => {
  try {
    const client = await getApolloServerClient()
    const { data } = await client.query({
      query: ValetDropsDocument,
      variables: {
        skip,
        take,
      },
      fetchPolicy: 'no-cache',
    })

    return {
      bookings: data?.valetDrops ?? [],
      totalCount: data?.valetDropsTotal ?? 0,
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

export const ShowValetAllDropTrips = async ({ page }: { page: number }) => {
  const take = TAKE_COUNT
  const skip = (page - 1) * take
  const { bookings, totalCount, error } = await loadDropTrips(skip, take)

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
            time: booking.endTime,
          }}
          end={{
            lat: booking.valetAssignment?.returnLat || undefined,
            lng: booking.valetAssignment?.returnLng || undefined,
          }}
          start={booking.slot.garage.address}
        >
          <AssignValetButton
            bookingId={booking.id}
            status={BookingStatus.ValetAssignedForCheckOut}
          >
            Accept
          </AssignValetButton>
        </ValetTripCard>
      ))}
    </ShowData>
  )
}
