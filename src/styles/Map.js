import React from "react";
import { indigo } from "@mui/material/colors";
import { Box } from "@mui/system";

const MapInformation = ({ children }) => {
    return (
        <div
            style={{
                backgroundColor: indigo[900],
                color: "white",
                padding: "6px 12px",
                fontFamily: "monospace",
                zIndex: 1,
                position: "absolute",
                top: 0,
                left: 260,
                margin: "12px",
                borderRadius: "4px",
            }}
        >
            {children}
        </div>
    );
};

const MapBox = (props) => {
    return (
        <Box
            width="100%"
            height="100vh"
            sx={
                props.isCursorSpecial && {
                    boxSizing: "border-box",
                    border: `5px solid ${indigo[900]}`,
                    "*": {
                        cursor: "pointer",
                    },
                }
            }
        >
            {props.children}
        </Box>
    );
};

export { MapInformation, MapBox };
