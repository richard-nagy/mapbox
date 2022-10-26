import { Paper, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

const LeftBarStack = (props) => {
    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
            sx={{
                minWidth: "250px",
                maxWidth: "250px",
                padding: "20px",
                backgroundColor: grey[100],
            }}
        >
            {props.children}
        </Stack>
    );
};

const PaperContainer = (props) => {
    return <Paper sx={{ width: "100%", padding: "10px" }}>{props.children}</Paper>;
};

export { LeftBarStack, PaperContainer };
