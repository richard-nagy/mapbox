import { Paper } from "@mui/material";
import * as React from "react";

function ControlPanel({ children, top }) {
    return (
        <Paper
            sx={{
                position: "absolute",
                alignItems: "center",
                top: top,
                margin: "10px",
                padding: "10px",
                maxWidth: "300px",
                minWidth: "300px",
                maxHeight: "calc(100% - 110px)",
                overflowY: "auto",
            }}
        >
            {children}
        </Paper>
    );
}

export default React.memo(ControlPanel);
