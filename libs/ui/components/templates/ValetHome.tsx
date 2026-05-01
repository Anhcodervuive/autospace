import { QueryTabs } from '../molecules/QueryTabs'
import { ShowValetAllPickupTrips } from '../organisms/ShowValetAllPickupTrips'
import { ShowValetAllDropTrips } from '../organisms/ShowValetAllDropTrips'

const TABS = [
    { label: 'Pickup', value: 'pickup' },
    { label: 'Drop', value: 'drop' },
] as const

export const ValetHome = ({
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
                defaultValue="pickup"
                resetParams={['page']}
            />
            {tab === 'pickup' ? <ShowValetAllPickupTrips page={page} /> : null}
            {tab === 'drop' ? <ShowValetAllDropTrips page={page} /> : null}
        </>
    )
}
