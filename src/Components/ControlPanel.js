import React from "react";
import { Paper } from "@mui/material";

const ControlPanel = ({ children, top }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                position: "absolute",
                alignItems: "center",
                top: top,
                margin: "10px",
                padding: "10px",
                maxWidth: "340px",
                minWidth: "340px",
                maxHeight: "calc(100vh - 120px)",
                overflowY: "auto",
            }}
        >
            {children}
        </Paper>
    );
};

export default React.memo(ControlPanel);
