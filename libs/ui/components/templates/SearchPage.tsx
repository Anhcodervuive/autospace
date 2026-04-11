import React, { useCallback } from 'react'
import { Map } from '../organisms/map/Map'
import { Panel } from '../organisms/map/Panel'
import { DefaultZoomControls } from '../organisms/map/ZoomControls'
import { ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { initialViewState } from '@autospace/util/constants'
import { SearchPlaceBox } from '../organisms/map/SearchPlacesBox'

const SearchPage = () => {
  const handleMapChange = useCallback((target: ViewStateChangeEvent['target']) => {
    const bounds = target.getBounds()
    const localFilter = {
      net_lat: bounds?.getNorthEast().lat || 0,
      net_lng: bounds?.getNorthEast().lng || 0,
      sw_lat: bounds?.getSouthWest().lat || 0,
      sw_lng: bounds?.getSouthWest().lng || 0,
    }
    console.log('Location filter', localFilter)
  }, [])
  return (
    <div>
        <Map
            onLoad={(e) => handleMapChange(e.target)}
            onDragStart={(e) => handleMapChange(e.target)}
            onDragEnd={(e) => handleMapChange(e.target)}
            initialViewState={initialViewState}
        >
            <Panel position='left-top'>
          <SearchPlaceBox />
            </Panel>
            <Panel position='right-center'>
                <DefaultZoomControls />
            </Panel>
        </Map>
    </div>
  )
}

export default SearchPage