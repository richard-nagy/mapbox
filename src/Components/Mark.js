import React from "react";
import { Marker } from "react-map-gl";
import { getDefaultLibFileName } from "typescript";
import image from "./marker.png";

const Mark = (props) => {
    return (
        <Marker {...props} anchor="bottom">
            <img src={image} />
        </Marker>
    );
};

export default Mark;
