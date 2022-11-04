import React from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Slider,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import ControlPanel from "./ControlPanel";
import { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";

const colros = ["#90caf9", "#ce93d8", "#f44336", "#ffa726", "#29b6f6", "#66bb6a"];

const Settings = ({ changeColorWidth }) => {
    const [open, setOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState(3);
    const [colorValue, setColorValue] = useState("#90caf9");

    const handleColorSelect = (color) => {
        setColorValue(color);
        changeColorWidth(color);
    };

    const handleWidthChange = (_, width) => {
        setSliderValue(width);
        changeColorWidth(undefined, width);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ControlPanel right={0} width={"auto"} padding="1px">
                <IconButton onClick={handleClickOpen}>
                    <SettingsIcon sx={{ fontSize: "18px" }} />
                </IconButton>
            </ControlPanel>

            <Dialog open={open}>
                <DialogTitle>
                    Settings
                    <IconButton
                        aria-label="close"
                        onClick={handleClickClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container sx={{ width: "250px" }}>
                        <Grid item xs={12}>
                            <Typography variant="body1">Color of line and marker</Typography>
                        </Grid>
                        {colros.map((color) => {
                            return (
                                <Grid item xs={2} key={color}>
                                    <IconButton onClick={() => handleColorSelect(color)}>
                                        {colorValue === color ? (
                                            <CircleIcon
                                                sx={{
                                                    color: color,
                                                }}
                                                fontSize="large"
                                            />
                                        ) : (
                                            <CircleTwoToneIcon
                                                sx={{
                                                    color: color,
                                                }}
                                                fontSize="large"
                                            />
                                        )}
                                    </IconButton>
                                </Grid>
                            );
                        })}
                        <Grid item xs={12}>
                            <Typography variant="body1">Size of line</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Slider
                                max={10}
                                onChange={handleWidthChange}
                                valueLabelDisplay="auto"
                                value={sliderValue}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Settings;
