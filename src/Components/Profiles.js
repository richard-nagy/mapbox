import { Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React from "react";
import ControlPanel from "./ControlPanel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

const Profiles = ({ profile, setProfile, fetchRoutes, timeDistance }) => {
    return (
        <ControlPanel>
            <Stack direction="row" spacing={2}>
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
                <div>
                    <Typography variant="body1">
                        <b>Distance:</b> {Math.round((timeDistance.distance / 1000) * 100) / 100} Km
                    </Typography>
                    <Typography variant="body1">
                        <b>Time:</b> {Math.round((timeDistance.time / 60) * 100) / 100} Minutes
                    </Typography>
                </div>
            </Stack>
        </ControlPanel>
    );
};

export default Profiles;
