import React from "react";
import {
    Button,
    ButtonGroup,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ControlPanel from "./ControlPanel";

const ListOfPlaces = ({ listOfPlaces, changeLocationOrder, deleteLocation }) => {
    return (
        <ControlPanel top={78}>
            <Typography variant="h6">List of places</Typography>
            {!listOfPlaces.current.length && (
                <>
                    <Divider sx={{ margin: "5px 0 5px 0" }} />
                    <Typography style={{ color: "gray" }} variant="caption">
                        Nothing is here yet ...
                    </Typography>
                </>
            )}
            <List sx={{ padding: 0 }}>
                {listOfPlaces.current.map((place, i) => {
                    return (
                        <div key={place.id}>
                            <Divider sx={{ margin: "5px 0 5px 0" }} />
                            <ListItem sx={{ padding: 0 }}>
                                <ListItemText primary={place.name} />
                                <IconButton
                                    sx={{ margin: "0 5px 0 5px" }}
                                    onClick={() => deleteLocation(i, place)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <ButtonGroup
                                    size="small"
                                    orientation="vertical"
                                    aria-label="outlined primary button group"
                                >
                                    <Button
                                        disabled={i === 0}
                                        onClick={() => changeLocationOrder(true, i)}
                                    >
                                        <ArrowDropUpIcon />
                                    </Button>
                                    <Button
                                        disabled={listOfPlaces.current.length - 1 === i}
                                        onClick={() => changeLocationOrder(false, i)}
                                    >
                                        <ArrowDropDownIcon />
                                    </Button>
                                </ButtonGroup>
                            </ListItem>
                        </div>
                    );
                })}
            </List>
        </ControlPanel>
    );
};

export { ListOfPlaces };
