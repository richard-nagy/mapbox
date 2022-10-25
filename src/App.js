import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import LeftBar from "./components/LeftBar";
import MapComponent from "./components/Map";
import { Stack } from "@mui/material";

export default function App() {
    const [isCursorSpecial, setIsCursorSpecial] = useState(false);

    const toggleSpecialCursor = () => {
        setIsCursorSpecial(!isCursorSpecial);
    };

    const propsToPass = {
        isCursorSpecial: isCursorSpecial,
        toggleSpecialCursor: toggleSpecialCursor,
        setIsCursorSpecial: setIsCursorSpecial,
    };

    return (
        <Stack direction="row">
            <LeftBar {...propsToPass} />
            <MapComponent {...propsToPass} />
        </Stack>
    );
}
