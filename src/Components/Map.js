import React, { useState } from "react";
import Mark from "./Mark";
import { Map } from "react-map-gl";
import { MapInformation, MapBox } from "../styles/Map";

let id = 0;

const MapComponent = (props) => {
    const { isCursorSpecial } = props;

    const [listOfPlaces, setListOfPlaces] = useState([
        { id: id++, longitude: 17.9093, latitude: 47.1028 },
        { id: id++, longitude: 19.0402, latitude: 47.4979 },
        { id: id++, longitude: 20.3772, latitude: 47.9025 },
    ]);

    function handleClick(map) {
        if (!isCursorSpecial) {
            return;
        }

        setListOfPlaces((old) => [
            ...old,
            { id: id++, longitude: map.lngLat.lng, latitude: map.lngLat.lat },
        ]);
    }

    return (
        <MapBox isCursorSpecial={isCursorSpecial}>
            <Map
                initialViewState={{
                    latitude: 47.1028,
                    longitude: 17.9093,
                    zoom: 7,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onClick={handleClick}
            >
                {listOfPlaces.map((place) => {
                    return <Mark key={place.id} {...place} />;
                })}
            </Map>
            {isCursorSpecial && <MapInformation>Selecting new waypoints</MapInformation>}
        </MapBox>
    );
};

export default MapComponent;
