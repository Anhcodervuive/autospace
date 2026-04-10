import { Marker as MarkerGl, MarkerProps } from 'react-map-gl/mapbox'

export const Marker = (props: MarkerProps) => {
    return <MarkerGl {...props} />
}