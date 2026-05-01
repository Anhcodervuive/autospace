import { QueryTabs } from '../molecules/QueryTabs'
import { ShowValetMyPickupTrips } from '../organisms/ShowValetMyPickupTrips'
import { ShowValetMyDropTrips } from '../organisms/ShowValetMyDropTrips'

const TABS = [
    { label: 'Pickup', value: 'pickup' },
    { label: 'Drop', value: 'drop' },
] as const

export const ValetTrips = ({
    uid,
    page,
    tab,
}: {
    uid: string
    page: number
    tab: (typeof TABS)[number]['value']
}) => {

    return (
        <>
            <QueryTabs
                items={[...TABS]}
                value={tab}
                paramName="tab"
                defaultValue="pickup"
                resetParams={['page']}
            />
            {tab === 'pickup' ? (
                <ShowValetMyPickupTrips uid={uid} page={page} />
            ) : null}
            {tab === 'drop' ? <ShowValetMyDropTrips uid={uid} page={page} /> : null}
        </>
    )
}
