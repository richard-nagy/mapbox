import React from "react";
import { Marker } from "react-map-gl";
import PlaceIcon from "@mui/icons-material/Place";
import { indigo } from "@mui/material/colors";

const StyledMarker = (props) => {
    return (
        <Marker {...props} anchor="bottom" style={{ height: "50px" }}>
            <PlaceIcon sx={{ fontSize: "40px", marginTop: "13px", color: indigo[900] }} />
        </Marker>
    );
};

export { StyledMarker };
