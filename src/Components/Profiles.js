import { Button, ButtonGroup, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import ControlPanel from "./ControlPanel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

const Profiles = ({ profile, setProfile, fetchRoutes }) => {
    return (
        <ControlPanel top={0}>
            <ToggleButtonGroup
                value={profile}
                exclusive
                color="primary"
                onChange={(_, newProfile) => {
                    if (newProfile !== null && newProfile !== profile) {
                        setProfile(newProfile);
                        fetchRoutes(newProfile);
                    }
                }}
                aria-label="text alignment"
            >
                <ToggleButton value="driving" aria-label="driving">
                    <DirectionsCarIcon />
                </ToggleButton>
                <ToggleButton value="cycling" aria-label="cicling">
                    <DirectionsBikeIcon />
                </ToggleButton>
                <ToggleButton value="walking" aria-label="walking">
                    <DirectionsWalkIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </ControlPanel>
    );
};

export default Profiles;
