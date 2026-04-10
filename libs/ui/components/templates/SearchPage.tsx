import React, { useCallback } from 'react'
import { Map } from '../organisms/map/Map'
import { Panel } from '../organisms/map/Panel'
import { DefaultZoomControls } from '../organisms/map/ZoomControls'
import { ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { initialViewState } from '@autospace/util/constants'

const SearchPage = () => {
  const handleMapChange = useCallback((target: ViewStateChangeEvent['target']) => {
    const bounds = target.getBounds()
    console.log('Map bounds changed:', bounds)
  }, [])
  return (
    <div>
        <Map
            onLoad={(e) => handleMapChange(e.target)}
            onDragStart={(e) => handleMapChange(e.target)}
            onDragEnd={(e) => handleMapChange(e.target)}
            initialViewState={initialViewState}
        >
            <Panel position='right-center'>
                <DefaultZoomControls />
            </Panel>
        </Map>
    </div>
  )
}

export default SearchPage