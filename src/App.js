import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import LeftBar from "./components/LeftBar";
import MapComponent from "./components/Map";
import { Stack } from "@mui/material";

let id = 0;

export default function App() {
    const [isWaypointOn, setsetIsWaypointOn] = useState(false);
    const [listOfPlaces, setListOfPlaces] = useState([
        { id: id++, longitude: 17.9093, latitude: 47.1028 },
        { id: id++, longitude: 19.0402, latitude: 47.4979 },
        { id: id++, longitude: 20.3772, latitude: 47.9025 },
    ]);

    const toggleSpecialCursor = () => {
        setsetIsWaypointOn(!isWaypointOn);
    };

    return (
        <Stack direction="row">
            <LeftBar toggleSpecialCursor={toggleSpecialCursor} listOfPlaces={listOfPlaces} />
            <MapComponent
                isWaypointOn={isWaypointOn}
                listOfPlaces={listOfPlaces}
                setListOfPlaces={setListOfPlaces}
                id={id}
            />
        </Stack>
    );
}
