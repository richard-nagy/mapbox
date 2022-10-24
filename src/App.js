import React, { useState } from "react";
import { Map, Marker } from "react-map-gl";
import "./style.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Mark from "./Components/Mark";

export default function App() {
    const [viewport, setViewport] = useState({
        latitude: 47.1028,
        longitude: 17.9093,
        zoom: 7,
    });

    const listOfPlaces = [
        { longitude: 17.9093, latitude: 47.1028 },
        { longitude: 19.0402, latitude: 47.4979 },
        { longitude: 20.3772, latitude: 47.9025 },
    ];

    return (
        <div className="App">
            <Map
                initialViewState={{
                    ...viewport,
                }}
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            >
                {listOfPlaces.map((place) => {
                    return <Mark {...place} />;
                })}
            </Map>
        </div>
    );
}
