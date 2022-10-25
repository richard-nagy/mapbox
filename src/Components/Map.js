import React from "react";
import Mark from "./Mark";
import { Map } from "react-map-gl";
import { MapBox } from "../styles/Map";
import Geocoder from "./Geocoder";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = (props) => {
    const { isWaypointOn, listOfPlaces, setListOfPlaces } = props;
    let { id } = props;

    const addWaypoint = (lng, lat) => {
        setListOfPlaces((old) => [...old, { id: id++, longitude: lng, latitude: lat }]);
    };

    const handleClick = (map) => {
        console.log(map);

        if (!isWaypointOn) {
            return;
        }

        addWaypoint(map.lngLat.lng, map.lngLat.lat);
    };

    return (
        <MapBox isWaypointOn={isWaypointOn}>
            <Map
                initialViewState={{
                    latitude: 47.1028,
                    longitude: 17.9093,
                    zoom: 7,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={TOKEN}
                onClick={handleClick}
            >
                <Geocoder addWaypoint={addWaypoint} />
                {listOfPlaces.map((place) => {
                    return <Mark key={place.id} {...place} />;
                })}
            </Map>
            {/* {isWaypointOn && <MapInformation>Selecting new waypoints</MapInformation>} */}
        </MapBox>
    );
};

export default MapComponent;
