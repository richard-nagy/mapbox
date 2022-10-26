import { Divider, FormControlLabel, List, ListItem, ListItemText, Switch } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { LeftBarStack, PaperContainer } from "../styles/LeftBar";

const LeftBar = (props) => {
    const { toggleSpecialCursor, listOfPlaces } = props;
    const [listOfWaypoints, setListOfWaypoints] = useState([]);

    useEffect(() => {
        if (listOfWaypoints.length === listOfPlaces.length) {
            return;
        }

        const array = [];
        let promises = [];

        listOfPlaces.forEach((place) => {
            if (listOfWaypoints.find((item) => item.id === place.id)) {
                return;
            }

            promises.push(
                axios
                    .get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${place.longitude},${place.latitude}.json?&access_token=pk.eyJ1IjoianNjYXN0cm8iLCJhIjoiY2s2YzB6Z25kMDVhejNrbXNpcmtjNGtpbiJ9.28ynPf1Y5Q8EyB_moOHylw`
                    )
                    .then((response) => {
                        array.push({
                            id: place.id,
                            place: response.data.features[0].place_name,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            );
        });

        Promise.all(promises).then(() => setListOfWaypoints((old) => [...old, ...array]));
    }, [listOfPlaces, listOfWaypoints]);

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
                {!listOfWaypoints ? (
                    "Loading..."
                ) : (
                    <List>
                        {listOfWaypoints.map((e) => {
                            return (
                                <ListItem key={e.id}>
                                    <ListItemText primary={e.place} />
                                    <Divider />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </PaperContainer>
        </LeftBarStack>
    );
};

export default LeftBar;
