import { BookingStatus } from '@autospace/network/src/gql/generated'
import { QueryTabs } from '../molecules/QueryTabs'
import { ShowCustomerBookings } from '../organisms/ShowCustomerBookings'

const TABS = [
    { label: 'PAST', value: 'past' },
    { label: 'ON GOING', value: 'ongoing' },
] as const

export const ListCustomerBookings = ({
    page,
    tab,
}: {
    page: number
    tab: (typeof TABS)[number]['value']
}) => {
    return (
        <>
            <QueryTabs
                items={[...TABS]}
                value={tab}
                paramName="tab"
                defaultValue="ongoing"
                resetParams={['page']}
            />
            {tab === 'past' ? (
                <ShowCustomerBookings
                    page={page}
                    statuses={[BookingStatus.CheckedOut, BookingStatus.ValetReturned]}
                />
            ) : (
                <ShowCustomerBookings
                    page={page}
                    statuses={[
                        BookingStatus.Booked,
                        BookingStatus.ValetPickedUp,
                        BookingStatus.ValetAssignedForCheckIn,
                        BookingStatus.CheckedIn,
                        BookingStatus.ValetAssignedForCheckOut,
                    ]}
                />
            )}
        </>
    )
}
