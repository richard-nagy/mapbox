import { Button, Card, FormControlLabel, Paper, Switch } from "@mui/material";
import React from "react";
import { LeftBarStack } from "../styles/LeftBar";

const LeftBar = (props) => {
    const { toggleSpecialCursor } = props;

    return (
        <LeftBarStack>
            <Paper>
                <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Select Waypont On Map"
                    labelPlacement="top"
                    onChange={toggleSpecialCursor}
                />
            </Paper>
        </LeftBarStack>
    );
};

export default LeftBar;
