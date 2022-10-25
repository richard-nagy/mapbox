import { Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

const LeftBarStack = (props) => {
    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ minWidth: "250px", padding: "5px", backgroundColor: grey[100] }}
        >
            {props.children}
        </Stack>
    );
};

export { LeftBarStack };
