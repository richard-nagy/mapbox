import { Divider, FormControlLabel, List, ListItem, ListItemText, Switch } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { LeftBarStack, PaperContainer } from "../styles/LeftBar";

const LeftBar = (props) => {
    const { toggleSpecialCursor, listOfPlaces } = props;
    const [listOfWaypoints, setListOfWaypoints] = useState([]);

    useEffect(() => {
        const array = [];
        let promises = [];

        // TODO: Add a filter to only fetch places that are not already in the list
        listOfPlaces.forEach((coordinate) => {
            promises.push(
                axios
                    .get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinate.longitude},${coordinate.latitude}.json?&access_token=pk.eyJ1IjoianNjYXN0cm8iLCJhIjoiY2s2YzB6Z25kMDVhejNrbXNpcmtjNGtpbiJ9.28ynPf1Y5Q8EyB_moOHylw`
                    )
                    .then((response) => {
                        array.push(response.data.features[0].place_name);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            );
        });

        Promise.all(promises).then(() => setListOfWaypoints(array));
    }, [listOfPlaces]);

    if (listOfWaypoints.length !== listOfPlaces.length) {
        return "Loading...";
    }

    return (
        <LeftBarStack>
            <PaperContainer>
                <FormControlLabel
                    control={<Switch color="primary" />}
                    label="Select Waypont On Map"
                    labelPlacement="top"
                    onChange={toggleSpecialCursor}
                />
            </PaperContainer>
            <PaperContainer>
                <List>
                    {listOfWaypoints.map((e) => {
                        return (
                            <ListItem>
                                <ListItemText primary={e} />
                                <Divider />
                            </ListItem>
                        );
                    })}
                </List>
            </PaperContainer>
        </LeftBarStack>
    );
};

export default LeftBar;
