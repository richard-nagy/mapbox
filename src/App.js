import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

export default function App() {
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 47.1028,
        longitude: 17.9093,
        zoom: 10,
        pitch: 0,
        bearing: 0,
    });

    return (
        <div className="App">
            <ReactMapGL
                {...viewport}
                mapStyle="mapbox://styles/rafilos556/ckhrp0auk0ol119s02qvctvh4"
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
            ></ReactMapGL>
        </div>
    );
}
