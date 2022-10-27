import React from "react";
import { Box } from "@mui/system";

const MapBox = (props) => {
    return (
        <Box
            width="100%"
            height="100vh"
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
