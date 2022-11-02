import React from "react";
import { Paper } from "@mui/material";

const ControlPanel = ({ children, top = 0, right = null, width = "340px", padding = "10px" }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                position: "absolute",
                alignItems: "center",
                top: top,
                right: right,
                margin: "10px",
                padding: padding,
                maxWidth: width,
                minWidth: width,
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
            }}
        >
            {children}
        </Paper>
    );
};

export default React.memo(ControlPanel);
