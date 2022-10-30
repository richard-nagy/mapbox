import React from "react";
import { Box } from "@mui/system";

const MapBox = (props) => {
    return (
        <Box
            sx={
                props.isMarkerOn
                    ? {
                          "*": {
                              cursor: "pointer",
                          },
                      }
                    : {}
            }
        >
            {props.children}
        </Box>
    );
};

export { MapBox };
