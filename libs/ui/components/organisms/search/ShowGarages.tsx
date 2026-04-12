import { useLazyQuery } from '@apollo/client/react'
import { SearchGaragesDocument } from '@autospace/network/src/gql/generated'
import { useEffect } from 'react'
import { GarageMarker } from './GarageMarker'
import { useConvertSearchFormToVariables } from '@autospace/forms/src/adapters/searchFormAdapter'

export const ShowGarages = () => {
    const [searchGarages, { loading, data, error }] = useLazyQuery(
        SearchGaragesDocument,
    )

    const { variables } = useConvertSearchFormToVariables()

    useEffect(() => {
        if (variables) {
            searchGarages({ variables })
        }
    }, [variables, searchGarages])

    return (
        <>
            {data?.searchGarages.map((garage) => (
                <GarageMarker key={garage.id} marker={garage} />
            ))}
        </>
    )
}