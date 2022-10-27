import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Switch,
    Typography,
} from "@mui/material";
import Mark from "./components/Mark";
import { Map } from "react-map-gl";
import { MapBox } from "./styles/Map";
import Geocoder from "./components/Geocoder";
import ControlPanel from "./components/ControlPanel";
import { getLocation } from "./apis/Location";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

let id = 0;

export default function App() {
    const [isMarkerOn, setsetIsMarkerOn] = useState(false);
    const [listOfPlaces, setListOfPlaces] = useState([]);

    const toggleSpecialCursor = () => {
        setsetIsMarkerOn(!isMarkerOn);
    };

    const addPlaceToList = (lng, lat) => {
        function getPlaceName(response) {
            const name = response.data.features[0].place_name;
            setListOfPlaces((old) => [
                ...old,
                { id: id++, longitude: lng, latitude: lat, name: name },
            ]);
        }

        getLocation(lng, lat, getPlaceName);
    };

    const handleClick = (map) => {
        if (!isMarkerOn) {
            return;
        }

        addPlaceToList(map.lngLat.lng, map.lngLat.lat);
    };

    const updateListOfPlaces = (event, id) => {
        const lng = event.lngLat.lng;
        const lat = event.lngLat.lat;

        function getPlaceName(response) {
            const name = response.data.features[0].place_name;
            const newState = listOfPlaces.map((obj) => {
                if (obj.id === id) {
                    return {
                        id: id,
                        longitude: lng,
                        latitude: lat,
                        name: name,
                    };
                }

                return obj;
            });
            setListOfPlaces(newState);
        }

        getLocation(lng, lat, getPlaceName);
    };

    return (
        <MapBox isMarkerOn={isMarkerOn}>
            <Map
                initialViewState={{
                    latitude: 47.1028,
                    longitude: 17.9093,
                    zoom: 7,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={TOKEN}
                onClick={handleClick}
            >
                <Geocoder addMarker={addPlaceToList} />
                {listOfPlaces.map((place) => {
                    return (
                        <Mark
                            draggable
                            onDragEnd={(event) => {
                                updateListOfPlaces(event, place.id);
                            }}
                            key={place.id}
                            {...place}
                        />
                    );
                })}
            </Map>
            <ControlPanel top={0}>
                <FormControlLabel
                    control={<Switch color="primary" />}
                    label="📌 Place marker on click"
                    labelPlacement="end"
                    onChange={toggleSpecialCursor}
                />
            </ControlPanel>
            <ControlPanel top={70}>
                <Typography variant="h6">List of places</Typography>
                <List sx={{ padding: 0 }}>
                    {listOfPlaces.map((place) => {
                        return (
                            <div key={place.id}>
                                <Divider sx={{ color: "red" }} />
                                <ListItem sx={{ padding: 0 }}>
                                    <ListItemText primary={place.name} />
                                </ListItem>
                            </div>
                        );
                    })}
                </List>
            </ControlPanel>
        </MapBox>
    );
}
