import { BookingStatus } from '@autospace/network/src/gql/generated'
import { QueryTabs } from '../molecules/QueryTabs'
import { ShowGarageBookings } from '../organisms/ShowGarageBookings'

export interface IListBookingsProps {
    garageId: number
    page: number
    query: string
    tab: 'in' | 'out' | 'resolved'
}

const TABS = [
    { label: 'IN', value: 'in' },
    { label: 'OUT', value: 'out' },
    { label: 'RESOLVED', value: 'resolved' },
] as const

export const ListGarageBookings = ({
    garageId,
    page,
    query,
    tab,
}: IListBookingsProps) => {

    return (
        <div>
            <QueryTabs
                items={[...TABS]}
                value={tab}
                paramName="tab"
                defaultValue="in"
                resetParams={['page']}
            />
            {tab === 'in' ? (
                <ShowGarageBookings
                    garageId={garageId}
                    page={page}
                    searchTerm={query}
                    statuses={[
                        BookingStatus.Booked,
                        BookingStatus.ValetPickedUp,
                        BookingStatus.ValetAssignedForCheckIn,
                    ]}
                    showCheckIn
                />
            ) : null}
            {tab === 'out' ? (
                <ShowGarageBookings
                    garageId={garageId}
                    page={page}
                    searchTerm={query}
                    statuses={[
                        BookingStatus.CheckedIn,
                        BookingStatus.ValetAssignedForCheckOut,
                    ]}
                    showCheckOut
                />
            ) : null}
            {tab === 'resolved' ? (
                <ShowGarageBookings
                    garageId={garageId}
                    page={page}
                    searchTerm={query}
                    statuses={[BookingStatus.CheckedOut]}
                />
            ) : null}
        </div>
    )
}
