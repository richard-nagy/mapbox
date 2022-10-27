import React from "react";
import { Marker } from "react-map-gl";
import PlaceIcon from "@mui/icons-material/Place";

const StyledMarker = (props) => {
    return (
        <Marker {...props} anchor="bottom" style={{ height: "50px" }}>
            <PlaceIcon color="warning" sx={{ fontSize: "40px", marginTop: "13px" }} />
        </Marker>
    );
};

export { StyledMarker };
